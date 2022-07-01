import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  inputContainer: {
    padding: 5,
  },
  inputStyle: {
    borderColor: "black",
    borderWidth: 1,
    padding: 10,
    borderRadius: 2,
  },
  manageTeamWrapper: {
    width: 350,
  },
  manageTeamTitle: {
    marginBottom: 10,
  },
  addTeamMemberInput: {
    borderBottomColor: "black",
    borderBottomWidth: 1,
    marginTop: 5,
    fontSize: 18,
  },
  manageTeamButtonContainer: {
    textAlign: "left",
    borderTopColor: "grey",
    borderTopWidth: 1,
    borderBottomColor: "grey",
    borderBottomWidth: 1,
  },
  plusButton: {
    fontSize: 28,
    fontWeight: "400",
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    width:300,
    height:'auto',
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    margin:10
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#E7717D",
  },
  buttonValidate: {
    backgroundColor: "#15DB95",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  QRDisplay: {
    padding:100
  },
  ButtonHorizontalAlign:{
    flexDirection: "row" ,
    marginLeft: 20, 
    justifyContent: 'space-evenly'
  },
  textMargin:{
    marginLeft: 20,
    marginRight: 20
  },
  marginTop:{
    marginTop: 20
  },
  border:{
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10
  },
  negativeMarginRight:{
    marginRight: -80
  },
  negativeMarginLeft:{
    marginLeft: -80
  },
  TextHorizontalAlign:{
    flexDirection: "row" ,
    marginLeft: 20, 
    justifyContent: 'space-between'
  },
  bold:{
    fontWeight: "bold"
  }
});

export default styles;
