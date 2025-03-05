import React from 'react';
import {View, StyleSheet, Modal, TouchableOpacity} from 'react-native';
import {Text} from '../general/text';
import {logoutUser} from '../../../helper/auth/auth';
import {useNavigation} from '@react-navigation/native';

const OptionModal = ({visible = false, showModal}) => {
  const navigation = useNavigation();

  return (
    <Modal
      visible={visible}
      transparent={true}
      onRequestClose={() => showModal(false)}>
      <View style={styles.container}>
        <View style={styles.listHolder}>
          <TouchableOpacity
            style={styles.list}
            activeOpacity={0.8}
            onPress={() => {
              showModal(false);
              logoutUser(navigation);
            }}>
            <Text style={{fontSize: 14}}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  line: {
    width: '100%',
    height: 1,
    backgroundColor: '#f9f9f9',
  },
  list: {
    width: '100%',
    backgroundColor: '#fff',
    paddingLeft: 20,
    justifyContent: 'center',
    height: 50,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  listHolder: {width: '60%', position: 'absolute', right: 5, top: 5},
});

export default OptionModal;
