// // ServiceProtocolScreen.js
// import React, { Component } from'react';
// import { View, Text, Image, StyleSheet, ScrollView } from'react-native';
// import { Actions } from'react-native-router-flux';
// import { Button } from'react-native-elements';
// import { connect } from'react-redux';
// import { bindActionCreators } from'redux';
// import { setProtocol } from '../../actions/protocolActions';

// class ServiceProtocolScreen extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       protocol: '',
//     };
//   }

//   componentDidMount() {
//     this.setState({
//       protocol: this.props.protocol,
//     });
//   }

//   handleAccept = () => {
//     this.props.setProtocol(true);
//     Actions.pop();
//   };

//   handleDecline = () => {
//     this.props.setProtocol(false);
//     Actions.pop();
//   };

//   render() {
//     return (
//       <View style={styles.container}>
//         <ScrollView>
//           <Text style={styles.title}>服务协议</Text>
//           <Text style={styles.text}>{this.props.protocol}</Text>
//           <Button
//             title="同意"
//             buttonStyle={styles.button}
//             onPress={this.handleAccept}
//           />
//           <Button
//             title="不同意"
//             buttonStyle={styles.button}
//             onPress={this.handleDecline}
//           />
//         </ScrollView>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     margin: 10,
//   },
//   text: {
//     margin: 10,
//     lineHeight: 20,
//   },
//   button: {
//     margin: 10,
//     backgroundColor: '#4CAF50',
//   },
// });

// const mapStateToProps = state => ({
//   protocol: state.protocol.protocol,
// });

// const mapDispatchToProps = dispatch =>
//   bindActionCreators({ setProtocol }, dispatch);

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps,
// )(ServiceProtocolScreen);

import React, { Component } from 'react';
import { View, Text, ScrollView, Linking, StyleSheet } from 'react-native';

class ServiceProtocolScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ServiceProtocol: this.getServiceProtocol(), // 直接设置服务协议内容
    };
  }

  getServiceProtocol() {
    return `
更新日期：2024年07月24日

生效日期：2024年07月24日

   1.导言

  欢迎您使用“123违章快查”软件及相关服务！

  “123违章快查”软件及相关服务，系指海南长留网络科技有限公司及其关联方（以下简称“公司”）合法拥有并运营的、标注名称为“123违章快查”的客户端应用程序（同时含其简化版等不同版本）向您提供的产品与服务，包括但不限于热门小说推荐、发布信息、搜索查询等核心功能及其他功能。《“123违章快查”用户服务协议》（以下称“本协议”）是您与公司就您下载、安装、注册、登录、使用（以下统称“使用”）“123违章快查”软件，并获得“123违章快查”软件提供的相关服务所订立的协议。

  为了更好地为您提供服务，请您在开始使用“123违章快查”软件及相关服务之前，认真阅读并充分理解本协议，特别是涉及免除或者限制责任的条款、权利许可和信息使用的条款、同意开通和使用特殊单项服务的条款、法律适用和争议解决条款等。其中，免除或者限制责任条款等重要内容将以加粗形式提示您注意，您应重点阅读。

  如您未满18周岁，请您在法定监护人陪同下仔细阅读并充分理解本协议，并征得法定监护人的同意后使用“123违章快查”软件及相关服务。

  如您不同意本协议，这将导致公司无法为您提供完整的产品和服务，您也可以选择停止使用。如您自主选择同意或使用“123违章快查”软件及相关服务，则视为您已充分理解本协议，并同意作为本协议的一方当事人接受本协议以及其他与“123违章快查”软件及相关服务相关的协议和规则（包括但不限于《“123违章快查”隐私政策》）的约束。`;
  }

  render() {
    const { ServiceProtocol } = this.state;
    return (
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.title}>服务协议</Text>
          <Text style={styles.text}>{ServiceProtocol}</Text>
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


export default ServiceProtocolScreen;