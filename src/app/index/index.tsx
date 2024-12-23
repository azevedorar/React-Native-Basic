import { useState, useCallback } from "react";

import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  Text,
  Alert,
  Linking,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { styles } from "./styles";
import { colors } from "@/styles/colors";
import { categories } from "@/utils/categories";
import { linkStorage, LinkStorage } from "@/storage/link-storage";

import { Link } from "@/componenets/link";
import { Option } from "@/componenets/option";
import { Categories } from "@/componenets/categories";
import { router, useFocusEffect } from "expo-router";
// IMPORTS

export default function Index() {
  const [showModal, setShowModal] = useState(false);
  const [link, setLink] = useState<LinkStorage>({} as LinkStorage);
  const [links, setLinks] = useState<LinkStorage[]>([]);
  const [category, setCategory] = useState(categories[0].name);

  async function getLinks() {
    try {
      const response = await linkStorage.get();
      const filtered = response.filter((link) => link.category === category);
      // console.log("refresh list");
      setLinks(filtered);
    } catch (error) {
      Alert.alert("Error", "Unable to list links");
    }
  }

  function handleDetails(seletected: LinkStorage) {
    setShowModal(true);
    setLink(seletected);
  }

  async function linkRemove() {
    try {
      await linkStorage.remove(link.id);
      getLinks();
      setShowModal(false);
    } catch (error) {
      Alert.alert("Error", "Could not delete");
      console.log(error);
    }
  }

  function handleRemove() {
    Alert.alert("Delete", "Do you really want to delete?", [
      { style: "cancel", text: "No" },
      { text: "Yes", onPress: linkRemove },
    ]);
  }

  async function handleOpen() {
    try {
      await Linking.openURL(link.url);
      setShowModal(false);
    } catch (error) {
      Alert.alert("Link", "Unable to open the link, try again");
      console.log(error);
    }
  }
  // UseEffect pratice = useEffect(() => {}, [])

  // useEffect(() => {
  //   getLinks();
  // }, [category]);

  useFocusEffect(
    useCallback(() => {
      getLinks();
    }, [category])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require("@/assets/logo.png")} style={styles.logo} />

        <TouchableOpacity onPress={() => router.navigate("./add")}>
          <MaterialIcons name="add" size={30} color={colors.green[300]} />
        </TouchableOpacity>
      </View>
      <Categories onChange={setCategory} selected={category} />

      <FlatList
        data={links}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link
            name={item.name}
            url={item.url}
            onDetails={() => handleDetails(item)}
          />
        )}
        style={styles.links}
        contentContainerStyle={styles.linksContent}
        showsVerticalScrollIndicator={false}
      />
      <Modal transparent visible={showModal} animationType="slide">
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalCategory}>{link.category}</Text>

              <TouchableOpacity onPress={() => setShowModal(false)}>
                <MaterialIcons
                  name="close"
                  size={20}
                  color={colors.gray[400]}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalLinkName}>{link.name}</Text>
            <Text style={styles.modalUrl}>{link.url}</Text>
            <View style={styles.modalFooter}>
              <Option
                name="Delete"
                icon="delete"
                variant="secondary"
                onPress={handleRemove}
              />
              <Option name="Open" icon="language" onPress={handleOpen} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
