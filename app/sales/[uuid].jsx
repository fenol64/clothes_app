import React, { useRef, useState } from 'react';
import { Alert, Button, Image, Modal, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';

// import { Container } from './styles';

const sales = () => {

    const [image, setImage] = useState(null);
    const [camera_modal, setCameraModal] = useState(false);
    const [chose_type_modal, setChoseTypeModal] = useState(false);
    const [camera_type, setCameraType] = useState(Camera.Constants.Type.back);

    const camera_ref = useRef(null);

    const pickImage = async (type = "camera") => {

        var result = null;
        if (type == "camera") {
            setCameraModal(true);
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

    return <View style={{ flex: 1, paddingTop: StatusBar.currentHeight, padding: 10 }}>
        <Text>Nova venda:</Text>

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button title="Pick an image from camera roll" onPress={() => setChoseTypeModal(true)} />
            {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
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