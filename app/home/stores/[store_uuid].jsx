import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { backend_api } from '../../../services/Api';
import { FontAwesome5 } from '@expo/vector-icons';
import { styles } from '../../index';
import { storage } from '../../../services/utils';

// import { Container } from './styles';

const stores = () => {
    const router = useRouter();
    const query = useLocalSearchParams();

    const [loading, setLoading] = useState(false)
    const [store, setStore] = useState({});

    const handleInputChange = (field, value) => {
        setStore({ ...store, [field]: value })
    }

    const getStore = async () => {
        try {
            setLoading(true)
            const filters = {
                uuid: query.store_uuid
            }

            const response = await backend_api.get(`/stores`, { timeout: 10000, params: filters })
            const data = response.data

            setStore(data[0])
        } catch (error) {
            console.log(error)
            Alert.alert("Erro", "Não foi possível carregar os dados da loja")
            router.back()
        } finally {
            setLoading(false)
        }
    }

    const saveStore = async () => {
        setLoading(true)
        try {
            if (!store.name || store.name.length <= 3) throw new Error("Preencha o nome da loja")

            const user = await storage.get("user")

            const payload = {
                user_uuid: user.uuid,
                name: store.name,
                obs: store.obs ?? null,
            }

            if (store.id) payload.id = store.id
            if (store.uuid) payload.uuid = store.uuid

            let response = null
            if (store.id) response = await backend_api.put(`/stores`, payload)
            else response = await backend_api.post(`/stores`, payload)

            const data = response.data

            if (data.insertId || data.affectedRows) {
                Alert.alert("Sucesso", "Loja salva com sucesso")
                router.back()
            } else {
                Alert.alert("Erro", "Não foi possível salvar a loja")
            }
        } catch (error) {
            console.log(error)
            Alert.alert("Erro", "Não foi possível salvar a loja")
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        if (query.store_uuid && query.store_uuid !== "new") {
            getStore()
        }
    }, [query]);

    return <View style={{ flex: 1, paddingTop: StatusBar.currentHeight, padding: 10 }}>
        <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 15, paddingHorizontal: 8 }}>
            <FontAwesome5 name="arrow-left" size={24} color="black" style={{ marginRight: 10 }} onPress={() => router.back()} />
            <Text style={{ fontSize: 24, fontWeight: "bold" }}>{store.id ? store.name : "Nova Loja"}</Text>
        </View>
        {loading && <ActivityIndicator size="large" color="#cecece" />}
        {!loading && <View style={{ marginTop: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 3, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: "#cecece", marginBottom: 20 }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>Nome</Text>
                    <TextInput
                        style={{ fontSize: 16, paddingVertical: 3 }}
                        onChangeText={text => handleInputChange("name", text)}
                        value={store.name}
                        placeholder="Nome do cliente"
                    />
                </View>
            </View>
            <View style={{ flexDirection: "column", paddingVertical: 3, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: "#cecece", marginBottom: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>Obs</Text>
                <TextInput
                    style={{ fontSize: 16, paddingBottom: 3 }}
                    onChangeText={text => handleInputChange("obs", text)}
                    value={store.obs}
                    placeholder="Observações"
                    multiline={true}
                    numberOfLines={7}
                />
            </View>
        </View>}

        <TouchableOpacity style={styles.button} onPress={saveStore}>
            <Text style={{ color: "#fff", fontSize: 24, textTransform: "uppercase", fontWeight: 900, letterSpacing: 3 }}>Salvar</Text>
        </TouchableOpacity>

    </View>


}

export default stores;