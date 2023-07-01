import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

// import { Container } from './styles';

const Select = ({ options, onChange }) => {
    const [selected, setSelected] = useState(false);
    const [modal, setModal] = useState(false);

    const handleSelect = (option) => {
        setSelected(option);
        onChange(option);
    }

    if (!options || !options.length) options = [{ label: "Selecione", value: null }];

    return <>
        <TouchableOpacity style={{ height: 40, justifyContent: "center", borderColor: 'gray', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10, marginBottom: 10 }} onPress={() => setModal(!modal)}>
            <Text style={{ fontSize: 14, fontWeight: "bold" }}>{selected.label ?? "selecione"}</Text>
        </TouchableOpacity>

        <Modal visible={modal} animationType="slide" transparent={true} onRequestClose={() => { setModal(!modal); }}>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
                <View style={{ width: '80%', backgroundColor: "white", padding: 20, borderRadius: 10 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>Escolha uma opção</Text>
                        <TouchableOpacity onPress={() => setModal(!modal)}>
                            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>
                                <FontAwesome name="close" size={24} color="black" />
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => {
                        handleSelect({ label: "Selecione", value: null });
                        setModal(!modal);
                    }} style={{ width: '100%', padding: 10, backgroundColor: "white", borderRadius: 10, justifyContent: "center", borderWidth: 1, borderColor: "black", marginBottom: 10 }}>
                        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Limpar</Text>
                    </TouchableOpacity>


                    {options.map((option, index) => <TouchableOpacity onPress={() => {
                        handleSelect(option);
                        setModal(!modal);
                    }} style={{ width: '100%', padding: 10, backgroundColor: "white", borderRadius: 10, justifyContent: "center", borderWidth: 1, borderColor: "black", marginBottom: 10 }}>
                        <Text style={{ fontSize: 16, fontWeight: "bold" }}>{option.label}</Text>
                    </TouchableOpacity>)}
                </View>
            </View>
        </Modal>


    </>
}

export default Select;