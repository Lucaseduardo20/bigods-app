import { Modal, View, StyleSheet, TouchableOpacity, Text } from "react-native"

export const ModalContainer = ({visible, setVisible, children, transparent = true}: any) => {
    return (
          <Modal
            visible={visible}
            transparent={transparent}
            animationType="fade"
          >
            <View style={styles.modal }>
              {children}
            </View>
          </Modal>
    )
}

const styles = StyleSheet.create({
    modal: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    }
})