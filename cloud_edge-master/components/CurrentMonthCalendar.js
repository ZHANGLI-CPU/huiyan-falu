import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet
} from 'react-native';
import { Agenda } from 'react-native-calendars';

export default class CurrentMonthCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: {},
      selected: '' // 初始化选中日期
    };
  }

  componentDidMount() {
    // 获取当前日期并设置为选中日期
    const currentDate = new Date();
    const selectedDate = this.timeToString(currentDate);
    this.setState({ selected: selectedDate }, () => {
      this.loadItems({ date: selectedDate }); // 加载当前选中日期的日程
    });
  }

  render() {
    return (
      <Agenda
        items={this.state.items}
        loadItemsForMonth={this.loadItems.bind(this)}
        selected={this.state.selected} // 使用当前日期作为选中日期
        renderItem={this.renderItem.bind(this)}
        renderEmptyDate={this.renderEmptyDate.bind(this)}
        rowHasChanged={this.rowHasChanged.bind(this)}
        theme={{
          agendaDayTextColor: 'gray', // 日历天数的文本颜色
          agendaDayNumColor: 'gray', // 日历天数的数字颜色
          agendaTodayColor: '#444444', // 今天的颜色
          agendaKnobColor: '#444444', // 滑动按钮的颜色
          selectedDayBackgroundColor: '#444444', // 选中日期的背景颜色
          selectedDayTextColor: 'white', // 选中日期的文本颜色
          todayTextColor: 'white', // 今天日期的文本颜色
          dayTextColor: 'white', // 普通日期的文本颜色
          textSectionTitleColor: 'gray', // 月份的文本颜色
          textSectionTitleDisabledColor: 'gray', // 月份的禁用文本颜色
          textDayFontSize: 16, // 日期字体大小
          textMonthFontSize: 16, // 月份字体大小
          textDayHeaderFontSize: 16, // 星期几的字体大小
          calendarBackground: '#333333', // 日历背景颜色
          agendaDayBackground: '#333333', // 日历天的背景颜色
          agendaItemHeight: 100, // 议程项的高度
          dotColor: '#444444', // 议程标记点的颜色
          selectedDotColor: '#666666', // 选中日期议程标记点的颜色
          monthTextColor: 'gray', // 月份标题的文本颜色
          agendaSelectedDayStyle: {
            backgroundColor: '#444444', // 选中日期的背景颜色
            color: 'white' // 选中日期的文本颜色
          },
          agendaSelectedDayTextStyle: {
            color: 'white' // 选中日期的文本颜色
          },
          agendaTodayStyle: {
            backgroundColor: '#444444', // 今天日期的背景颜色
            color: 'white' // 今天日期的文本颜色
          }
        }}
      />
    );
  }

  loadItems(day) {
    setTimeout(() => {
      const selectedDate = this.state.selected;

      // 仅加载当前选中日期的日程
      if (day.dateString !== selectedDate) {
        return;
      }

      const time = new Date(day.dateString).getTime(); // 使用 dateString 转换为时间戳
      const strTime = this.timeToString(time);

      if (!this.state.items[strTime]) {
        this.state.items[strTime] = [];
        const numItems = Math.floor(Math.random() * 5);
        for (let j = 0; j < numItems; j++) {
          this.state.items[strTime].push({
            name: '事件已收集书面材料' + strTime,
            height: Math.max(50, Math.floor(Math.random() * 150))
          });
        }
      }

      const newItems = {};
      Object.keys(this.state.items).forEach(key => { newItems[key] = this.state.items[key]; });
      this.setState({
        items: newItems
      });
    }, 1000);
  }

  renderItem(item) {
    return (
      <View style={[styles.item, { height: item.height }]}><Text>{item.name}</Text></View>
    );
  }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}><Text>This is empty date!</Text></View>
    );
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  timeToString(time) {
    const date = new Date(time);
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', time);
      return '';
    }
    return date.toISOString().split('T')[0];
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  }
});