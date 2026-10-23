import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';

import OperatorMenu from '../components/OperatorMenu';
import { getReportEvents } from '../api/ReportApi';
import { getReportedEvents } from '../api/ReportedApi';
import { getAppeals } from '../api/AppealApi';

function MessageScreen() {
  const [reportEvents, setReportEvents] = useState([]);
  const [reportedEvents, setReportedEvents] = useState([]);
  const [appealEvents, setAppealEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [reports, reported, appeals] = await Promise.all([
        getReportEvents(),
        getReportedEvents(),
        getAppeals(),
      ]);
      setReportEvents(Array.isArray(reports) ? reports : []);
      setReportedEvents(Array.isArray(reported) ? reported : []);
      // 仅保留有申诉状态的事件，避免空状态混入申诉列表
      const filteredAppeals = Array.isArray(appeals)
        ? appeals.filter(
            (event) =>
              event &&
              event.appeal_status != null &&
              String(event.appeal_status).trim() !== ''
          )
        : [];
      setAppealEvents(filteredAppeals);
    } catch (err) {
      console.error('加载消息失败:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  return (
    <View style={styles.container}>
      <OperatorMenu
        reportEvents={reportEvents}
        reportedEvents={reportedEvents}
        appealEvents={appealEvents}
        loading={loading}
        error={error}
        onReload={loadEvents}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MessageScreen;
