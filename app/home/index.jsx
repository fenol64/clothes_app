import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { EvilIcons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { storage } from '../../services/utils';

// import { Container } from './styles';

const home = () => {

    const router = useRouter()

    const [user, setUser] = useState({})

    const logout = async () => {
        Alert.alert("Logout", "Deseja realmente sair?", [
            {
                text: "Não",
                style: "cancel"
            },
            {
                text: "Sim",
                onPress: async () => {
                    await storage.remove("user")
                    router.push("/")
                }
            }
        ])

    }

    useEffect(() => {
        (async () => {
            const user = await storage.get("user")
            setUser(user)
        })()
    }, []);

    const shortcuts = [
        {
            title: "Nova venda",
            icon: <FontAwesome5 name="plus" size={24} color="black" />,
            onPress: () => router.push("/sales/new")
        },
        {
            title: "Novo cliente",
            icon: <FontAwesome5 name="user-plus" size={24} color="black" />,
            onPress: () => router.push("/clients/new")
        },
        {
            title: "Nova loja",
            icon: <FontAwesome5 name="store" size={24} color="black" />,
            onPress: () => router.push("/stores/new")
        }
    ]

    const cards = [
        {
            title: "Vendas",
            icon: <FontAwesome5 name="cash-register" size={24} color="black" />,
            onPress: () => router.push("/sales")
        },
        {
            title: "Clientes",
            icon: <FontAwesome5 name="users" size={24} color="black" />,
            onPress: () => router.push("/clients")
        },
        {
            title: "Lojas",
            icon: <FontAwesome5 name="store" size={24} color="black" />,
            onPress: () => router.push("/stores")
        }
    ]

    return <View style={{ flex: 1, paddingTop: StatusBar.currentHeight, padding: 10 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", }}>
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                <EvilIcons name="user" size={42} color="black" />
                <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 10 }}>Olá, {user.name?.split(" ")[0]}!</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                {/* bell icon */}
                <TouchableOpacity onPress={logout}>
                    <MaterialIcons name="logout" size={24} color="black" />
                </TouchableOpacity>
            </View>
        </View>

        <View style={{ marginTop: 20 }}>


            <View style={{
                padding: 10,
            }}>
                <Text style={{ fontSize: 24, fontWeight: 900 }}>Vendas do mês</Text>
                <Text style={{ fontSize: 18, fontWeight: 900 }}>R$ 0,00</Text>
            </View>

            <View style={{ marginTop: 20 }}>
                <Text style={{ fontSize: 24, fontWeight: 900, marginBottom: 10 }}>Atalhos:</Text>
                <ScrollView horizontal={true}>
                    {shortcuts.map((card, index) => <TouchableOpacity key={index} onPress={card.onPress} style={{
                        width: 150,
                        borderRadius: 10,
                        borderWidth: 1,
                        marginRight: 10,
                        borderColor: "#ccc",
                        padding: 10,
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: 10
                    }}>
                        {card.icon}
                        <Text style={{ fontSize: 16, fontWeight: 900, marginTop: 10 }}>{card.title}</Text>
                    </TouchableOpacity>)}
                </ScrollView>
            </View>


            <View style={{ marginTop: 20 }}>
                <Text style={{ fontSize: 24, fontWeight: 900, marginBottom: 10 }}>Menu:</Text>
                <ScrollView horizontal={true}>
                    {cards.map((card, index) => <TouchableOpacity key={index} onPress={card.onPress} style={{
                        width: 150,
                        borderRadius: 10,
                        borderWidth: 1,
                        marginRight: 10,
                        borderColor: "#ccc",
                        padding: 10,
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: 10
                    }}>
                        {card.icon}
                        <Text style={{ fontSize: 16, fontWeight: 900, marginTop: 10 }}>{card.title}</Text>
                    </TouchableOpacity>)}
                </ScrollView>
            </View>
        </View>
    </View>;
}

export default home;