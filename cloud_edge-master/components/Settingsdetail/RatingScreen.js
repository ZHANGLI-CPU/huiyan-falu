import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ratingLabels = [
  { text: '非常差', emoji: '😞', color: '#FF4D4F' },
  { text: '差', emoji: '😕', color: '#FF7A45' },
  { text: '一般', emoji: '😐', color: '#FFC53D' },
  { text: '满意', emoji: '😊', color: '#73D13D' },
  { text: '非常满意', emoji: '🤩', color: '#52C41A' },
];

const tagOptions = [
  '界面美观', '功能实用', '操作流畅', '反应迅速',
  '定位准确', '举报便捷', '奖励及时', '安全可靠',
];

const RatingScreen = () => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const maxRating = 5;

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const completionScale = useRef(new Animated.Value(0.6)).current;
  const starScales = useRef([...Array(maxRating)].map(() => new Animated.Value(1))).current;
  const checkScale = useRef(new Animated.Value(0)).current;
  const confettiAnims = useRef([...Array(12)].map(() => ({
    x: new Animated.Value(0),
    y: new Animated.Value(0),
    rotate: new Animated.Value(0),
    opacity: new Animated.Value(0),
    scale: new Animated.Value(0),
  }))).current;

  useEffect(() => {
    if (submitted) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.spring(completionScale, {
            toValue: 1,
            friction: 6,
            tension: 40,
            useNativeDriver: true,
          }),
          Animated.spring(checkScale, {
            toValue: 1,
            friction: 4,
            tension: 60,
            delay: 200,
            useNativeDriver: true,
          }),
          ...confettiAnims.map((anim, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const distance = 80 + Math.random() * 60;
            return Animated.parallel([
              Animated.timing(anim.x, {
                toValue: Math.cos(angle) * distance,
                duration: 800,
                delay: 100 + i * 40,
                useNativeDriver: true,
              }),
              Animated.timing(anim.y, {
                toValue: Math.sin(angle) * distance - 40,
                duration: 800,
                delay: 100 + i * 40,
                useNativeDriver: true,
              }),
              Animated.timing(anim.rotate, {
                toValue: 360 * (Math.random() > 0.5 ? 1 : -1),
                duration: 800,
                delay: 100 + i * 40,
                useNativeDriver: true,
              }),
              Animated.sequence([
                Animated.timing(anim.opacity, {
                  toValue: 1,
                  duration: 100,
                  delay: 100 + i * 40,
                  useNativeDriver: true,
                }),
                Animated.timing(anim.opacity, {
                  toValue: 0,
                  duration: 500,
                  delay: 300,
                  useNativeDriver: true,
                }),
              ]),
              Animated.sequence([
                Animated.timing(anim.scale, {
                  toValue: 1,
                  duration: 200,
                  delay: 100 + i * 40,
                  useNativeDriver: true,
                }),
                Animated.timing(anim.scale, {
                  toValue: 0,
                  duration: 400,
                  delay: 200,
                  useNativeDriver: true,
                }),
              ]),
            ]);
          }),
        ]),
      ]).start();
    }
  }, [submitted]);

  const handleStarPress = (index) => {
    const newRating = index + 1;
    setRating(newRating);
    Animated.sequence([
      Animated.timing(starScales[index], {
        toValue: 1.4,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(starScales[index], {
        toValue: 1,
        friction: 3,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (rating === 0) return;
    setSubmitted(true);
  };

  const confettiColors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF78C4', '#A66CFF', '#FF9F45', '#00C9A7', '#FF6F91', '#845EC2', '#FFC75F', '#F9F871'];

  if (submitted) {
    return (
      <View style={styles.completionContainer}>
        <Animated.View
          style={[
            styles.completionCard,
            {
              transform: [{ scale: completionScale }],
            },
          ]}
        >
          {confettiAnims.map((anim, i) => (
            <Animated.View
              key={i}
              style={[
                styles.confetti,
                {
                  backgroundColor: confettiColors[i % confettiColors.length],
                  transform: [
                    { translateX: anim.x },
                    { translateY: anim.y },
                    {
                      rotate: anim.rotate.interpolate({
                        inputRange: [-360, 0, 360],
                        outputRange: ['-360deg', '0deg', '360deg'],
                      })
                    },
                    { scale: anim.scale },
                  ],
                  opacity: anim.opacity,
                },
              ]}
            />
          ))}

          <Animated.View style={[styles.checkCircle, { transform: [{ scale: checkScale }] }]}>
            <Ionicons name="checkmark" size={48} color="white" />
          </Animated.View>

          <Text style={styles.completionTitle}>感谢您的评价！</Text>

          <View style={styles.completionRatingRow}>
            {[...Array(maxRating)].map((_, i) => (
              <Ionicons
                key={i}
                name={i < rating ? 'star' : 'star-outline'}
                size={22}
                color={i < rating ? '#FFD700' : '#E0E0E0'}
                style={{ marginHorizontal: 2 }}
              />
            ))}
          </View>

          <Text style={styles.completionSubtitle}>
            您的{rating}星评价已提交成功
          </Text>

          {selectedTags.length > 0 && (
            <View style={styles.completionTagsRow}>
              {selectedTags.map((tag) => (
                <View key={tag} style={styles.completionTag}>
                  <Text style={styles.completionTagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}

          {feedback.trim().length > 0 && (
            <View style={styles.completionFeedbackBox}>
              <Ionicons name="chatbubble-ellipses" size={16} color="#4682B4" />
              <Text style={styles.completionFeedbackText}>{feedback}</Text>
            </View>
          )}

          <View style={styles.completionRewardBanner}>
            <Ionicons name="gift" size={20} color="#52C41A" />
            <Text style={styles.completionRewardText}>
              感谢您的反馈，我们将持续优化产品体验
            </Text>
          </View>
        </Animated.View>

        <TouchableOpacity
          style={styles.doneButton}
          activeOpacity={0.8}
        >
          <Ionicons name="home" size={18} color="white" />
          <Text style={styles.doneButtonText}>返回首页</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.formWrapper, { opacity: fadeAnim }]}>
          <View style={styles.headerSection}>
            <View style={styles.iconCircle}>
              <Ionicons name="star" size={32} color="#FFD700" />
            </View>
            <Text style={styles.title}>为我们的应用评分</Text>
            <Text style={styles.subtitle}>
              您的评价是我们前进的动力
            </Text>
          </View>

          <View style={styles.starsCard}>
            <View style={styles.starsRow}>
              {[...Array(maxRating)].map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleStarPress(index)}
                  activeOpacity={0.7}
                >
                  <Animated.View style={{ transform: [{ scale: starScales[index] }] }}>
                    <Ionicons
                      name={index < rating ? 'star' : 'star-outline'}
                      size={44}
                      color={index < rating ? '#FFD700' : '#D9D9D9'}
                      style={styles.starIcon}
                    />
                  </Animated.View>
                </TouchableOpacity>
              ))}
            </View>

            {rating > 0 && (
              <View style={styles.labelRow}>
                <Text style={styles.labelEmoji}>{ratingLabels[rating - 1].emoji}</Text>
                <Text style={[styles.labelText, { color: ratingLabels[rating - 1].color }]}>
                  {ratingLabels[rating - 1].text}
                </Text>
              </View>
            )}

            <Text style={styles.ratingHint}>
              {rating === 0 ? '点击星星进行评分' : `${rating} / ${maxRating} 星`}
            </Text>
          </View>

          <View style={styles.tagsSection}>
            <Text style={styles.sectionTitle}>您觉得哪些方面做得好？（可多选）</Text>
            <View style={styles.tagsGrid}>
              {tagOptions.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <TouchableOpacity
                    key={tag}
                    style={[styles.tagChip, isSelected && styles.tagChipSelected]}
                    onPress={() => toggleTag(tag)}
                    activeOpacity={0.7}
                  >
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={14} color="#1890ff" style={{ marginRight: 4 }} />
                    )}
                    <Text style={[styles.tagChipText, isSelected && styles.tagChipTextSelected]}>
                      {tag}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.feedbackSection}>
            <Text style={styles.sectionTitle}>补充建议（可选）</Text>
            <View style={styles.textInputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="说说您的想法，帮助我们做得更好..."
                placeholderTextColor="#BFBFBF"
                value={feedback}
                onChangeText={setFeedback}
                multiline
                maxLength={200}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>{feedback.length}/200</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.submitButton, rating === 0 && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          activeOpacity={rating === 0 ? 1 : 0.8}
          disabled={rating === 0}
        >
          <Ionicons
            name="send"
            size={18}
            color={rating === 0 ? '#BFBFBF' : 'white'}
            style={{ marginRight: 8 }}
          />
          <Text style={[styles.submitButtonText, rating === 0 && styles.submitButtonTextDisabled]}>
            提交评价
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  formWrapper: {
    flex: 1,
  },

  headerSection: {
    alignItems: 'center',
    paddingTop: 36,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF8E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#8C8C8C',
  },

  starsCard: {
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 20,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  starIcon: {
    marginHorizontal: 6,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 4,
  },
  labelEmoji: {
    fontSize: 22,
    marginRight: 8,
  },
  labelText: {
    fontSize: 18,
    fontWeight: '700',
  },
  ratingHint: {
    fontSize: 13,
    color: '#BFBFBF',
    marginTop: 8,
  },

  tagsSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  tagChipSelected: {
    backgroundColor: '#E6F7FF',
    borderColor: '#1890ff',
  },
  tagChipText: {
    fontSize: 13,
    color: '#666',
  },
  tagChipTextSelected: {
    color: '#1890ff',
    fontWeight: '600',
  },

  feedbackSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  textInputWrapper: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  textInput: {
    fontSize: 14,
    color: '#333',
    minHeight: 90,
    lineHeight: 20,
    padding: 0,
  },
  charCount: {
    fontSize: 12,
    color: '#BFBFBF',
    textAlign: 'right',
    marginTop: 4,
  },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1890FF',
    paddingVertical: 14,
    borderRadius: 10,
    shadowColor: '#1890FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    backgroundColor: '#F0F0F0',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  submitButtonTextDisabled: {
    color: '#BFBFBF',
  },

  completionContainer: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  completionCard: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 36,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
    position: 'relative',
    overflow: 'hidden',
  },
  confetti: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: -4,
    marginTop: -4,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#52C41A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#52C41A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  completionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 12,
  },
  completionRatingRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  completionSubtitle: {
    fontSize: 14,
    color: '#8C8C8C',
    marginBottom: 20,
  },
  completionTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 8,
  },
  completionTag: {
    backgroundColor: '#E6F7FF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#91D5FF',
  },
  completionTagText: {
    fontSize: 12,
    color: '#1890FF',
    fontWeight: '500',
  },
  completionFeedbackBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F6FFED',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#B7EB8F',
    marginBottom: 16,
    width: '100%',
  },
  completionFeedbackText: {
    flex: 1,
    fontSize: 13,
    color: '#52C41A',
    marginLeft: 8,
    lineHeight: 20,
  },
  completionRewardBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    padding: 12,
    borderRadius: 8,
    width: '100%',
  },
  completionRewardText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    marginLeft: 8,
    lineHeight: 20,
  },
  doneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1890FF',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 24,
    shadowColor: '#1890FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  doneButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});

export default RatingScreen;
