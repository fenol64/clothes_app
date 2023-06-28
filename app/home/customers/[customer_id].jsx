import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { backend_api } from '../../../services/Api';
import { FontAwesome5 } from '@expo/vector-icons';
import { styles } from '../../index.jsx';
import { extractNumbers, storage } from '../../../services/utils';

// import { Container } from './styles';

const customers = () => {
    const router = useRouter()
    const params = useLocalSearchParams()

    const [loading, setLoading] = useState(false)
    const [customer, setCustomer] = useState({});

    const getCustomer = async () => {
        setLoading(true)
        try {
            const response = await backend_api.get(`/customers`, { timeout: 10000, params: { uuid: params.customer_id } })
            const data = response.data
            console.log({ data })
            setCustomer(data[0])
        } catch (error) {
            console.log(error)
            Alert.alert("Erro", "Não foi possível carregar os dados do cliente")
            router.back()
        } finally {
            setLoading(false)
        }
    }

    const saveCustomer = async () => {
        setLoading(true)
        try {
            if (!customer.name) throw new Error("Preencha o nome do cliente")

            const user = await storage.get("user")


            const payload = {
                user_uuid: user.uuid,
                name: customer.name,
                document: customer.document,
                phone: extractNumbers(customer.phone),
                email: customer.email,
            }

            if (customer.id) payload.id = customer.id
            if (customer.uuid) payload.uuid = customer.uuid

            let response = null
            if (customer.id) response = await backend_api.put(`/customers`, payload)
            else response = await backend_api.post(`/customers`, payload)

            const data = response.data

            if (data.insertId || data.affectedRows) {
                Alert.alert("Sucesso", "Cliente salvo com sucesso")
                router.back()
            }

        } catch (error) {
            console.log({ error })
            Alert.alert("Erro", error.message ?? "Não foi possível salvar o cliente")
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (name, value) => {
        setCustomer({ ...customer, [name]: value })
    }

    useEffect(() => {
        if (
            params.customer_id &&
            params.customer_id !== "new"
        ) {
            getCustomer()
        }
    }, [params]);

    return <View style={{ flex: 1, paddingTop: StatusBar.currentHeight, padding: 10 }}>
        <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 15, paddingHorizontal: 8 }}>
            <FontAwesome5 name="arrow-left" size={24} color="black" style={{ marginRight: 10 }} onPress={() => router.back()} />
            <Text style={{ fontSize: 24, fontWeight: "bold" }}>{customer.id ? customer.name : "Novo Cliente"}</Text>
        </View>
        {loading && <ActivityIndicator size="large" color="#cecece" style={{ marginTop: 20 }} />}
        {!loading && <View style={{ marginTop: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 3, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: "#cecece", marginBottom: 20 }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>Nome</Text>
                    <TextInput
                        style={{ fontSize: 16, paddingVertical: 3 }}
                        onChangeText={text => handleInputChange("name", text)}
                        value={customer.name}
                        placeholder="Nome do cliente"
                    />
                </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 3, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: "#cecece", marginBottom: 20 }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>CPF</Text>
                    <TextInput
                        style={{ fontSize: 16, paddingVertical: 3 }}
                        onChangeText={text => handleInputChange("cpf", text)}
                        value={customer.document}
                        placeholder="CPF do cliente"
                        keyboardType='numeric'

                    />
                </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 3, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: "#cecece", marginBottom: 20 }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>Telefone</Text>
                    <TextInput
                        style={{ fontSize: 16, paddingVertical: 3 }}
                        onChangeText={text => handleInputChange("phone", text)}
                        keyboardType='numeric'
                        value={customer.phone}
                        placeholder="Telefone do cliente"
                    />
                </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 3, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: "#cecece", marginBottom: 20 }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>E-mail</Text>
                    <TextInput
                        style={{ fontSize: 16, paddingVertical: 3 }}
                        onChangeText={text => handleInputChange("email", text)}
                        value={customer.email}
                        placeholder="E-mail do cliente"
                    />
                </View>
            </View>
            <TouchableOpacity style={styles.button} onPress={saveCustomer}>
                <Text style={{ color: "#fff", fontSize: 24, textTransform: "uppercase", fontWeight: 900, letterSpacing: 3 }}>Salvar</Text>
            </TouchableOpacity>
        </View>}
    </View>
}

export default customers;