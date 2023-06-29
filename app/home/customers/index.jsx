import { FontAwesome5 } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { backend_api } from '../../../services/Api';
import { mysqlDateTime, storage } from '../../../services/utils';

// import { Container } from './styles';

const customers = () => {

    const router = useRouter()

    const [loading, setLoading] = useState(true)
    const [customers, setCustomers] = useState([]);

    const getCustomers = async () => {
        setLoading(true)
        try {
            let user = await storage.get("user")

            const filters = {
                limit: 100,
                user_uuid: user.uuid
            };
            const response = await backend_api.get("/customers", { timeout: 10000, params: filters })
            const data = response.data
            console.log({ data })
            setCustomers(data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const deleteCustomer = async (uuid) => {
        setLoading(true)

        try {
            Alert.alert(
                "Atenção",
                "Deseja realmente excluir este cliente?",
                [
                    {
                        text: "Cancelar",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                    {
                        text: "Sim", onPress: async () => {
                            const response = await backend_api.put(`/customers`, {
                                id: null,
                                uuid,
                                deleted_at: mysqlDateTime(),
                            }, { timeout: 10000 })
                            const data = response.data
                            console.log({ data })
                            getCustomers()
                        }
                    }
                ],
                { cancelable: false }
            );
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        getCustomers()
    }, []);

    return <View style={{ flex: 1, paddingTop: StatusBar.currentHeight, padding: 10 }}>
        <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 15, paddingHorizontal: 8 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FontAwesome5 name="arrow-left" size={24} color="black" style={{ marginRight: 10 }} onPress={() => router.back()} />
                <Text style={{ fontSize: 24, fontWeight: "bold" }}>Clientes</Text>
            </View>
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                <FontAwesome5 name="search" size={24} color="black" style={{ marginRight: 20 }} />
                <Link href="/home/customers/new">
                    <FontAwesome5 name="plus" size={24} color="black" />
                </Link>
            </View>
        </View>
        {loading && <ActivityIndicator size="large" color="#cecece" style={{ marginTop: 20 }} />}
        {!loading && customers.length < 1 && <Text style={{ marginTop: 20, textAlign: "center" }}>Nenhum cliente cadastrado</Text>}
        {!loading && customers.length > 0 && <View style={{ marginTop: 20 }}>
            {customers.map((customer, index) => {
                return <View key={index} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 15, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: "#cecece" }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 18, fontWeight: "bold" }}>{customer.name}</Text>
                        <Text style={{ fontSize: 14, color: "#cecece" }}>{customer.email}</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <TouchableOpacity onPress={() => router.push(`/home/customers/${customer.uuid}`)}>
                            <FontAwesome5 name="edit" size={24} color="black" style={{ marginRight: 20 }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            deleteCustomer(customer.uuid)
                        }}>
                            <FontAwesome5 name="trash" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
            })}
        </View>}
    </View>;
}

export default customers;