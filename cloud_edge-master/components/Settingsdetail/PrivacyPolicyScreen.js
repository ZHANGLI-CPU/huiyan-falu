// PrivacyPolicyScreen.js
// 从外部导入隐私政策内容
// import React, { Component } from 'react';
// import { View, Text, ScrollView, Linking, StyleSheet } from 'react-native';

// class PrivacyPolicyScreen extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       privacyPolicy: '',
//     };
//   }

//   async componentDidMount() {
//     try {
//       const response = await fetch(
//         'https://raw.githubusercontent.com/cloud-edge/privacy-policy/main/privacy-policy.md'
//       );
//       const text = await response.text();
//       this.setState({ privacyPolicy: text });
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   render() {
//     const { privacyPolicy } = this.state;
//     return (
//       <View style={styles.container}>
//         <ScrollView>
//           <Text style={styles.title}>Privacy Policy</Text>
//           <Text style={styles.text}>{privacyPolicy}</Text>
//         </ScrollView>
//         <View style={styles.buttonContainer}>
//           <Text
//             style={styles.button}
//             onPress={() => Linking.openURL('https://cloud-edge.com/')}
//           >
//             Back to Home
//           </Text>
//         </View>
//       </View>
//     );
//   }
// }

// // 在文件内部定义样式
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#fff',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },
//   text: {
//     fontSize: 16,
//     lineHeight: 24,
//   },
//   buttonContainer: {
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   button: {
//     fontSize: 16,
//     color: '#007BFF',
//     textDecorationLine: 'underline',
//   },
// });

// export default PrivacyPolicyScreen;

// PrivacyPolicyScreen.js
import React, { Component } from 'react';
import { View, Text, ScrollView, Linking, StyleSheet } from 'react-native';

class PrivacyPolicyScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      privacyPolicy: this.getPrivacyPolicy(), // 直接设置隐私政策内容
    };
  }

  getPrivacyPolicy() {
    return `
更新日期： 2024年07月24日

生效日期：2024年07月24日

123违章快查（以下简称“本款产品”或“本应用”）。本声明仅适用于本款产品。如果您有任何疑问、意见或建议，请通过以下联系方式与我们联系： appgame@hainanchangliu.com。

海南长留网络科技有限公司 （以下简称“我们”）作为本应用的运营者，我们深知个人信息对您的重要性，并会尽全力保护您的个人信息安全可靠。我们致力于维护您对我们的信任，恪守以下原则，保护您的个人信息：权责一致原则、目的明确原则、选择同意原则、最少够用原则、确保安全原则、主体参与原则、公开透明原则等。同时，我们承诺，我们将按业界成熟的安全标准，采取相应的安全保护措施来保护您的个人信息。

请您在使用本应用及相关服务前务必审慎阅读、充分理解各条款内容，特别是免除或限制责任的相应条款，以及开通或使用某项服务的单独协议，并选择接受或不接受。限制、免责条款可能以加粗及下划线形式提示您注意。

如您未明示同意本隐私声明并开始使用，我们将仅收集为本应用软件运行所必需的信息，这将导致我们无法为您提供完整的产品和服务，但我们同样会采用去标识化、加密等措施来保护这些信息。我们将在明确获得您的同意和接受后，为您提供相应的服务。当您选择继续或再次使用时，基于提供产品和服务所必需，将视为您接受和认可我们按照本声明对您的相关信息进行处理。为了给您提供更好的服务，我们会根据产品的更新情况及法律法规的相关要求更新本政策的条款，该更新构成本政策的一部分。当隐私协议在您使用后发生变更时，我们将以信息推送形式等通知您。若您继续使用我们的服务，需要审慎地阅读变更后的协议。您有权不接受修改后的协议，应当停止使用本应用提供的软件或服务。

您有违反本协议的任何行为时，我们有权依照违反情况，随时单方限制、中止或终止向您提供本服务，并有权追究您的相关责任。

如果您未满 18 周岁，请在监护人的陪同下阅读本协议及其他上述协议，并事先取得您的家长或法定监护人的同意。若您是未成年人的监护人，当您对您所监护的未成年人的个人信息有相关疑问时，请通过本隐私政策约定的联系方式与我们联系。
    `;
  }

  render() {
    const { privacyPolicy } = this.state;
    return (
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.title}>隐私政策</Text>
          <Text style={styles.text}>{privacyPolicy}</Text>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <Text
            style={styles.button}
            onPress={() => Linking.openURL('https://cloud-edge.com/')}
          >
            问题反馈
          </Text>
        </View>
      </View>
    );
  }
}

// 在文件内部定义样式
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#4682B4',
    textAlign: 'center', // 添加此行以实现居中对齐
},

  text: {
    //  position: 'absolute',
    //  left: 68,
    //  top: 61,
    //  width: 661,
    //  height: 951,
    //  opacity: 1,
     
    //  fontFamily: '思源黑体 CN', // 请在这里添加正确的字体名称
     fontSize: 16,
     fontWeight: '350',
     lineHeight: /*'normal'*/24,
     letterSpacing: 0,
     
     fontVariationSettings: '"opsz" auto',
     fontFeatureSettings: '"kern" on',
     color: 'black',
 },
 buttonContainer: {
     marginTop: 20,
     alignItems: 'center',
 },
 button: {
     fontSize: 16,
     color: '#007BFF',
     textDecorationLine: 'underline',
 },
});


export default PrivacyPolicyScreen;

