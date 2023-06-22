import React, { useState } from 'react';
import { Alert, Button, Image, StatusBar, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

// import { Container } from './styles';

const sales = () => {

    const [image, setImage] = useState(null);

    const pickImage = async (type = "camera") => {

        var result = null;

        console.log({ type })

        if (type == "camera") {


            // see if we have permission to access the camera roll
            const { status } = await ImagePicker.requestCameraPermissionsAsync();

            console.log({ status })

            if (status !== 'granted') {
                Alert.alert('Sorry, we need camera roll permissions to make this work!');
                return;
            }

            result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
        }

        if (type == "gallery") {
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
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

    return <View style={{ flex: 1, paddingTop: StatusBar.currentHeight, padding: 10 }}>
        <Text>Nova venda:</Text>

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button title="Pick an image from camera roll" onPress={() => pickImage()} />
            {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
        </View>
    </View>

}

export default sales;