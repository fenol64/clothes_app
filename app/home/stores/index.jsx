import { FontAwesome5 } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StatusBar, Text, View } from 'react-native';
import { backend_api } from '../../../services/Api';
import { mysqlDateTime } from '../../../services/utils';

// import { Container } from './styles';

const stores = () => {

    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [stores, setStores] = useState([]);

    const getStores = async () => {
        setLoading(true)
        try {
            const response = await backend_api.get("/stores", { timeout: 10000 })
            const data = response.data
            console.log({ data })
            setStores(data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getStores()
    }, [])


    return <View style={{ flex: 1, paddingTop: StatusBar.currentHeight, padding: 10 }}>
        <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 15, paddingHorizontal: 8 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FontAwesome5 name="arrow-left" size={24} color="black" style={{ marginRight: 10 }} onPress={() => router.back()} />
                <Text style={{ fontSize: 24, fontWeight: "bold" }}>Lojas</Text>
            </View>
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                <FontAwesome5 name="search" size={24} color="black" style={{ marginRight: 20 }} />
                <Link href="/home/stores/new">
                    <FontAwesome5 name="plus" size={24} color="black" />
                </Link>
            </View>
        </View>
        {loading ? <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#cecece" />
        </View> : <View style={{ flex: 1 }}>
            <FlatList
                data={stores}
                renderItem={({ item }) => <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 15, paddingHorizontal: 8 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.name}</Text>
                        <Text style={{ fontSize: 14, color: "#cecece" }}>{item.address ?? "SEM ENDEREÇO"}</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <FontAwesome5 name="edit" size={24} color="black" style={{ marginRight: 20 }} onPress={() => router.push(`/home/stores/${item.uuid}`)} />
                        <FontAwesome5 name="trash" size={24} color="black" onPress={() => {
                            Alert.alert(
                                "Excluir loja",
                                "Deseja realmente excluir esta loja?",
                                [
                                    {
                                        text: "Cancelar",
                                        onPress: () => console.log("Cancel Pressed"),
                                        style: "cancel"
                                    },
                                    {
                                        text: "Sim", onPress: async () => {
                                            const response = await backend_api.put(`/stores`, {
                                                id: null,
                                                uuid: item.uuid,
                                                deleted_at: mysqlDateTime(),
                                            }, { timeout: 10000 })
                                            const data = response.data
                                            console.log({ data })
                                            getStores()
                                        }
                                    }
                                ],
                                { cancelable: false }
                            );
                        }} />
                    </View>
                </View>}
                keyExtractor={item => item.uuid}
            />
        </View>}
    </View>;
}

export default stores;