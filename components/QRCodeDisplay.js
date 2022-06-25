import QRCode from 'react-native-qrcode-svg';
import styles from "../stylesheet";
const CryptoJS = require('crypto-js');


export default function QRCodeDisplay(props) {
  let user = props.user
  let mission = props.mission
  let signObject = `{"user":${user.id},"mission":${mission.id},"name":"${user.lastname + ' ' + user.firstname}"}`
  let encrypted = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(signObject))
  console.log(encrypted)
  console.log('user: ',mission)
    return(
        <QRCode 
        size={200}
        value={encrypted}
      />
    )
}
