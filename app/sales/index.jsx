import { FontAwesome5 } from '@expo/vector-icons';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StatusBar, Text, TextInput, TouchableOpacity, View, Button, ActivityIndicator } from 'react-native';
import { backend_api } from '../../services/Api';
import Select from '../../components/Select';
import { dateMask, priceMask, storage } from '../../services/utils';
import number_format from 'locutus/php/strings/number_format';

// import { Container } from './styles';

const sales = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [loading, setLoading] = useState(true)
    const [search_modal, setSearchModal] = useState(false)
    const [search_form, setSearchForm] = useState({})
    const [stores, setStores] = useState([]);
    const [sales, setSales] = useState([]);


    const getStores = async () => {
        setLoading(true)
        try {
            const response = await backend_api.get("/stores", { timeout: 10000 })
            const data = response.data

            const stores_select = data.map(store => {
                return { label: store.name, value: store.uuid }
            })
            console.log({ data })
            setStores(stores_select)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const getSales = async () => {
        setLoading(true)
        try {
            const payload = {}
            const user = await storage.get("user")
            payload.user_uuid = user.user_uuid
            if (search_form.inicial_date) payload.inicial_date = search_form.inicial_date
            if (search_form.final_date) payload.final_date = search_form.final_date
            if (search_form.customer_name) payload.customer_name = search_form.customer_name
            if (search_form.store_uuid) payload.store_uuid = search_form.store_uuid

            const response = await backend_api.get("/checkouts", { params: payload, timeout: 10000 })
            const data = response.data
            console.log({ data })
            setSales(data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleStatus = (status) => {
        switch (status) {
            case 0:
                return "Cancelado";
            case 1:
                return "Aberto";
            case 2:
                return "Pendente";
            case 3:
                return "Finalizado";
            case 4:
                return "Entregue";
            default:
                return "Aberto";
        }
    }







    useEffect(() => {
        (async () => {
            await getStores()
            getSales()
        })();
    }, [])


    return <View style={{ flex: 1, flexDirection: "column", paddingTop: StatusBar.currentHeight, padding: 10 }}>
        <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 15, paddingHorizontal: 8 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FontAwesome5 name="arrow-left" size={24} color="black" style={{ marginRight: 10 }} onPress={() => router.back()} />
                <Text style={{ fontSize: 24, fontWeight: "bold" }}>Vendas</Text>
            </View>
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                <TouchableOpacity onPress={() => setSearchModal(!search_modal)}>
                    {search_modal ?
                        <FontAwesome5 name="times" size={24} color="black" style={{ marginRight: 20 }} /> :
                        <FontAwesome5 name="search" size={24} color="black" style={{ marginRight: 20 }} />
                    }
                </TouchableOpacity>
            </View>
        </View>
        {search_modal && <View >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: "bold" }}>Data Inicial</Text>
                    <TextInput
                        style={{ width: "98%", height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10, marginBottom: 10 }}
                        onChangeText={text => {

                            const date = text.replace(/\D/g, '')
                            const day = date.substring(0, 2)
                            const month = date.substring(2, 4)
                            const year = date.substring(4, 8)

                            let date_string = "";
                            if (day) date_string += day;
                            if (month) date_string += `/${month}`;
                            if (year) date_string += `/${year}`;

                            setSearchForm({ ...search_form, inicial_date: date_string })
                        }}
                        placeholder='Data'
                        keyboardType='numeric'
                        value={search_form.inicial_date}
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: "bold" }}>Data Final</Text>
                    <TextInput
                        style={{ height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10, marginBottom: 10 }}
                        onChangeText={text => {

                            const date = text.replace(/\D/g, '')
                            const day = date.substring(0, 2)
                            const month = date.substring(2, 4)
                            const year = date.substring(4, 8)


                            let date_string = "";
                            if (day) date_string += day;
                            if (month) date_string += `/${month}`;
                            if (year) date_string += `/${year}`;


                            setSearchForm({ ...search_form, final_date: date_string })
                        }}
                        placeholder='Data'
                        keyboardType='numeric'
                        value={search_form.final_date}
                    />
                </View>
            </View>

            <Text style={{ fontSize: 14, fontWeight: "bold" }}>Cliente</Text>
            <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10, marginBottom: 10 }}
                onChangeText={text => setSearchForm({ ...search_form, customer_name: text })}
                placeholder='Nome do cliente'
                value={search_form.customer_name}
            />
            <Text style={{ fontSize: 14, fontWeight: "bold" }}>Loja</Text>
            <Select options={stores} onChange={(selected) => {
                setSearchForm({ ...search_form, store_uuid: selected.value })
            }} />
            <Button title="Pesquisar" onPress={() => {
                console.log(search_form)
            }} />

        </View>}

        <View style={{ flex: 1, flexDirection: "column", justifyContent: "space-between" }}>
            {loading && <ActivityIndicator size="large" color="#cecece" />}
            {!loading && sales.length < 1 && <View style={{ flex: 1, alignItems: "center" }}>
                <Text>Nenhuma venda encontrada</Text>
            </View>}
            {!loading && sales.length > 0 && <>
                {sales.map(sale => {
                    return <View key={sale.uuid} style={{ flexDirection: "column", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#cecece" }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontWeight: 900 }}>#{new Date(sale.protocol).getTime()}</Text>
                                <Text>{dateMask(sale.created_at)}</Text>
                                <Text style={{ fontWeight: 900 }}>{sale.customer_name.toUpperCase()}</Text>
                            </View>
                            <View>
                                <FontAwesome5 name="eye" size={18} color="black" onPress={() => router.push("/sales/" + sale.uuid)} style={{ padding: 10, backgroundColor: "#cecece", borderRadius: 5 }} />
                            </View>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
                            <View style={{
                                flexDirection: "row"
                            }}>
                                <Text>{handleStatus(sale.status)}</Text>
                                <Text style={{ textAlign: "center", marginHorizontal: 10 }}>{sale.store_name ?? "SEM LOJA"}</Text>
                            </View>
                            <View style={{ flexDirection: "row" }}>
                                <Text style={{ textAlign: "center" }}>R$ {number_format(sale.total_price, 2, ",", ".")}</Text>
                                <FontAwesome5 name="shopping-cart" size={14} color="black" style={{ marginLeft: 8, marginRight: 2 }} />
                                <Text style={{ textAlign: "center" }}>{sale.total_items}</Text>
                            </View>
                        </View>
                    </View>

                })}
            </>}
        </View>




    </View>;
}

export default sales;