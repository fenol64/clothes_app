import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, Image, Modal, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { backend_api } from '../../services/Api';
import { CheckoutDateMask } from '../../services/utils';

// import { Container } from './styles';

const sales = () => {
    const route = useRouter();
    const params = useLocalSearchParams();

    const [image, setImage] = useState(null);
    const [camera_modal, setCameraModal] = useState(false);
    const [chose_type_modal, setChoseTypeModal] = useState(false);
    const [camera_type, setCameraType] = useState(Camera.Constants.Type.back);
    const [checkout, setCheckout] = useState({});
    const [checkout_item_form, setCheckoutItemForm] = useState({});
    const total = checkout.items?.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);



    const camera_ref = useRef(null);

    const pickImage = async (type = "camera") => {

        var result = null;
        if (type == "camera") {

            const { status } = await Camera.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Precisamos de permissão para usar a câmera');
                return;
            }

            setCameraModal(true);
            return;
        }

        if (type == "gallery") {
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
        }

        console.log(result)

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const takePicture = async () => {
        if (camera_ref) {
            const options = { quality: 0.5, base64: true };
            const data = await camera_ref.current.takePictureAsync(options);
            console.log(data.uri);
            setImage(data.uri);
            setCameraModal(false);
        }
    };

    const createCheckout = async () => {
    }

    const getCheckout = async (uuid) => {
        try {
            const response = backend_api.get(`/checkouts`, { params: { uuid } });
            const response_items = backend_api.get(`/checkouts/items`, { params: { checkout_uuid: uuid } });
            const response_payments = backend_api.get(`/checkouts/payments`, { params: { checkout_uuid: uuid } });

            const [checkout, items, payments] = await Promise.all([response, response_items, response_payments]);

            const payload = {
                ...checkout.data[0],
                items: items.data ?? [],
                payments: payments.data ?? []
            }

            setCheckout(payload);

        } catch (error) {
            Alert.alert("Erro ao buscar venda");
            route.navigate("/sales");
        }
    }


    useEffect(() => {
        if (params.uuid && params.uuid != "new") getCheckout(params.uuid);
        else createCheckout();
    }, [params]);

    return <View style={{ flex: 1, paddingTop: StatusBar.currentHeight, padding: 10 }}>

        {checkout?.uuid && <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20, padding: 5 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <TouchableOpacity onPress={() => route.navigate("/sales")}>
                    <FontAwesome5 name="arrow-left" size={18} color="black" />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 12 }}>{checkout?.uuid ? <>Venda #{checkout?.uuid.split("-")[0]}</> : "Nova venda"}</Text>
            </View>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>{CheckoutDateMask(checkout?.created_at)}</Text>
        </View>}



        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20, padding: 5 }}>
            <View >
                {image ? <>
                    <Image source={{ uri: image }} style={{ width: 150, height: 180 }} />
                    <Button title="Remover Imagem" onPress={() => setImage(null)} />
                </> : <>
                    <FontAwesome5 name="camera" size={150} color="black" />
                    <Button title="Selecionar imagem" onPress={() => setChoseTypeModal(true)} />
                </>}


            </View>
            <View style={{ flex: 1, marginLeft: 20 }}>
                <TextInput placeholder="Nome do produto" style={{ fontSize: 16, marginBottom: 20, borderWidth: 1, borderRadius: 5, paddingLeft: 5 }} />
                <TextInput placeholder="Preço" keyboardType='numeric' style={{ fontSize: 16, marginBottom: 20, borderWidth: 1, borderRadius: 5, paddingLeft: 5 }} />
                <TextInput placeholder="Quantidade" keyboardType='numeric' style={{ fontSize: 16, marginBottom: 20, borderWidth: 1, borderRadius: 5, paddingLeft: 5 }} />
                <TextInput placeholder="Descrição do produto" style={{ fontSize: 16, marginBottom: 20, borderWidth: 1, borderRadius: 5, paddingLeft: 5 }} multiline={true} numberOfLines={4} />

                <TouchableOpacity style={{ backgroundColor: "black", padding: 10, borderRadius: 10, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>Adicionar</Text>
                </TouchableOpacity>
            </View>
        </View>
        <View style={{ flex: 1 }}>

        </View>













        <Modal visible={camera_modal} animationType="slide" transparent={true} onRequestClose={() => {
            setCameraModal(!camera_modal);
        }}>
            <Camera
                style={{ flex: 1 }}
                type={camera_type}
                ref={camera_ref}
            >
                <View
                    style={{
                        flex: 1,
                        backgroundColor: 'transparent',
                        flexDirection: 'row',
                    }}>
                    <View style={{ flex: 1, backgroundColor: 'transparent', flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", padding: 15, position: 'absolute', bottom: 0, width: '100%' }}>
                        <TouchableOpacity onPress={() => {
                            setCameraType(
                                camera_type === Camera.Constants.Type.back
                                    ? Camera.Constants.Type.front
                                    : Camera.Constants.Type.back
                            );
                        }} >
                            <FontAwesome5 name="sync" size={24} color="black" />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={takePicture}>
                            <View style={{ width: 50, height: 50, backgroundColor: 'white', borderRadius: 50, justifyContent: "center", alignItems: "center" }}>
                                <FontAwesome5 name="camera" size={24} color="black" />
                            </View>

                        </TouchableOpacity>


                        <TouchableOpacity onPress={() => {
                            setCameraModal(!camera_modal);
                        }} >
                            <FontAwesome name="close" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Camera>
        </Modal>
        <Modal visible={chose_type_modal} animationType="slide" transparent={true} onRequestClose={() => {
            setChoseTypeModal(!chose_type_modal);
        }}>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
                <View style={{ width: '80%', backgroundColor: "white", padding: 20, borderRadius: 10 }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>Escolha uma opção</Text>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <TouchableOpacity onPress={() => {
                            pickImage("camera");
                            setChoseTypeModal(!chose_type_modal);
                        }} style={{ width: '45%', height: 100, backgroundColor: "white", borderRadius: 10, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "black" }}>
                            <FontAwesome5 name="camera" size={24} color="black" />
                            <Text style={{ fontSize: 16, fontWeight: "bold" }}>Câmera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            pickImage("gallery");
                            setChoseTypeModal(!chose_type_modal);
                        }} style={{ width: '45%', height: 100, backgroundColor: "white", borderRadius: 10, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "black" }}>
                            <FontAwesome5 name="images" size={24} color="black" />
                            <Text style={{ fontSize: 16, fontWeight: "bold" }}>Galeria</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    </View>

}

export default sales;