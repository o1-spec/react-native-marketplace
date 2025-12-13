import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'How do I create a listing?',
    answer: 'Tap the "+" button in the tab bar, fill in your product details, add photos, set a price, and publish. It\'s that simple!',
    category: 'Selling',
  },
  {
    id: '2',
    question: 'How do I edit or delete my listing?',
    answer: 'Go to your Profile, tap on the listing you want to edit, then tap the edit icon. To delete, tap the three dots and select "Delete Listing".',
    category: 'Selling',
  },
  {
    id: '3',
    question: 'What payment methods are accepted?',
    answer: 'We accept all major credit cards, debit cards, PayPal, and Apple Pay. Payments are processed securely through our platform.',
    category: 'Payment',
  },
  {
    id: '4',
    question: 'How does shipping work?',
    answer: 'Sellers can choose their preferred shipping method. Buyers pay for shipping at checkout. We recommend using tracked shipping for all items.',
    category: 'Shipping',
  },
  {
    id: '5',
    question: 'What is your return policy?',
    answer: 'Returns are accepted within 14 days of delivery if the item doesn\'t match the description. Contact the seller first, and if unresolved, contact our support team.',
    category: 'Returns',
  },
  {
    id: '6',
    question: 'How do I report a suspicious listing?',
    answer: 'Tap the three dots on any listing and select "Report". Choose a reason and our team will review it within 24 hours.',
    category: 'Safety',
  },
  {
    id: '7',
    question: 'How do I contact a seller?',
    answer: 'On any product page, tap the "Message Seller" button to start a conversation. You can discuss details, negotiate prices, and arrange pickup or shipping.',
    category: 'Buying',
  },
  {
    id: '8',
    question: 'Can I save items for later?',
    answer: 'Yes! Tap the heart icon on any product to save it to your Favorites. Access your saved items from your Profile.',
    category: 'Buying',
  },
  {
    id: '9',
    question: 'How do I get verified?',
    answer: 'Complete your profile with a phone number and email. Make your first sale, and after positive reviews, you\'ll receive a verified badge.',
    category: 'Account',
  },
  {
    id: '10',
    question: 'What fees do you charge?',
    answer: 'We charge a 5% service fee on completed sales. Listing items is completely free. Payment processing fees may apply.',
    category: 'Fees',
  },
];

const contactMethods = [
  {
    id: '1',
    title: 'Email Support',
    subtitle: 'support@marketplace.com',
    icon: 'mail',
    color: '#4ECDC4',
    action: () => Linking.openURL('mailto:support@marketplace.com'),
  },
  {
    id: '2',
    title: 'Live Chat',
    subtitle: 'Available 9 AM - 6 PM EST',
    icon: 'chatbubbles',
    color: '#A29BFE',
    action: () => Alert.alert('Live Chat', 'Coming soon...'),
  },
  {
    id: '3',
    title: 'Phone Support',
    subtitle: '+1 (800) 123-4567',
    icon: 'call',
    color: '#55EFC4',
    action: () => Linking.openURL('tel:+18001234567'),
  },
  {
    id: '4',
    title: 'Help Center',
    subtitle: 'Browse articles & guides',
    icon: 'book',
    color: '#FFB84D',
    action: () => Alert.alert('Help Center', 'Coming soon...'),
  },
];

const categories = ['All', 'Selling', 'Buying', 'Payment', 'Shipping', 'Returns', 'Safety', 'Account', 'Fees'];

export default function HelpScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const filteredFAQs = faqData.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#2D3436" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#636E72" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for help..."
              placeholderTextColor="#B2BEC3"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#B2BEC3" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Contact Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get in Touch</Text>
          <View style={styles.contactGrid}>
            {contactMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={styles.contactCard}
                onPress={method.action}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.contactIcon,
                    { backgroundColor: method.color + '20' },
                  ]}
                >
                  <Ionicons
                    name={method.icon as any}
                    size={28}
                    color={method.color}
                  />
                </View>
                <Text style={styles.contactTitle}>{method.title}</Text>
                <Text style={styles.contactSubtitle}>{method.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Category Filter */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browse by Category</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  selectedCategory === category && styles.activeCategoryChip,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category && styles.activeCategoryText,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Frequently Asked Questions ({filteredFAQs.length})
          </Text>

          {filteredFAQs.length > 0 ? (
            <View style={styles.faqList}>
              {filteredFAQs.map((faq) => (
                <TouchableOpacity
                  key={faq.id}
                  style={styles.faqItem}
                  onPress={() => toggleFAQ(faq.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.faqHeader}>
                    <View style={styles.faqLeft}>
                      <View style={styles.faqIconContainer}>
                        <Ionicons
                          name="help-circle"
                          size={20}
                          color="#4ECDC4"
                        />
                      </View>
                      <View style={styles.faqTextContainer}>
                        <Text style={styles.faqQuestion}>{faq.question}</Text>
                        <Text style={styles.faqCategory}>{faq.category}</Text>
                      </View>
                    </View>
                    <Ionicons
                      name={
                        expandedFAQ === faq.id
                          ? 'chevron-up'
                          : 'chevron-down'
                      }
                      size={20}
                      color="#B2BEC3"
                    />
                  </View>
                  {expandedFAQ === faq.id && (
                    <View style={styles.faqAnswer}>
                      <Text style={styles.answerText}>{faq.answer}</Text>
                      <TouchableOpacity style={styles.helpfulButton}>
                        <Ionicons
                          name="thumbs-up-outline"
                          size={16}
                          color="#636E72"
                        />
                        <Text style={styles.helpfulText}>Was this helpful?</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.noResults}>
              <Ionicons name="search-outline" size={48} color="#B2BEC3" />
              <Text style={styles.noResultsText}>No results found</Text>
              <Text style={styles.noResultsSubtext}>
                Try different keywords or browse by category
              </Text>
            </View>
          )}
        </View>

        {/* Still Need Help */}
        <View style={styles.section}>
          <View style={styles.needHelpCard}>
            <Ionicons name="headset" size={48} color="#4ECDC4" />
            <Text style={styles.needHelpTitle}>Still need help?</Text>
            <Text style={styles.needHelpText}>
              Our support team is here to assist you
            </Text>
            <TouchableOpacity
              style={styles.contactSupportButton}
              onPress={() => Linking.openURL('mailto:support@marketplace.com')}
            >
              <Ionicons name="mail" size={20} color="#fff" />
              <Text style={styles.contactSupportText}>Contact Support</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Links</Text>
          <View style={styles.quickLinks}>
            <TouchableOpacity
              style={styles.quickLinkItem}
              onPress={() => Alert.alert('Terms of Service', 'Coming soon...')}
            >
              <Ionicons name="document-text-outline" size={20} color="#636E72" />
              <Text style={styles.quickLinkText}>Terms of Service</Text>
              <Ionicons name="chevron-forward" size={18} color="#B2BEC3" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickLinkItem}
              onPress={() => Alert.alert('Privacy Policy', 'Coming soon...')}
            >
              <Ionicons name="shield-checkmark-outline" size={20} color="#636E72" />
              <Text style={styles.quickLinkText}>Privacy Policy</Text>
              <Ionicons name="chevron-forward" size={18} color="#B2BEC3" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickLinkItem}
              onPress={() => Alert.alert('Community Guidelines', 'Coming soon...')}
            >
              <Ionicons name="people-outline" size={20} color="#636E72" />
              <Text style={styles.quickLinkText}>Community Guidelines</Text>
              <Ionicons name="chevron-forward" size={18} color="#B2BEC3" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickLinkItem}
              onPress={() => Alert.alert('Safety Tips', 'Coming soon...')}
            >
              <Ionicons name="shield-outline" size={20} color="#636E72" />
              <Text style={styles.quickLinkText}>Safety Tips</Text>
              <Ionicons name="chevron-forward" size={18} color="#B2BEC3" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3436',
  },
  content: {
    flex: 1,
  },
  searchSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#2D3436',
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 16,
  },
  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  contactCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  contactIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 4,
    textAlign: 'center',
  },
  contactSubtitle: {
    fontSize: 12,
    color: '#636E72',
    textAlign: 'center',
  },
  categoriesContainer: {
    gap: 8,
    paddingBottom: 4,
  },
  categoryChip: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  activeCategoryChip: {
    backgroundColor: '#2D3436',
    borderColor: '#2D3436',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#636E72',
  },
  activeCategoryText: {
    color: '#fff',
  },
  faqList: {
    gap: 12,
  },
  faqItem: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  faqIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5F9F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  faqTextContainer: {
    flex: 1,
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 4,
  },
  faqCategory: {
    fontSize: 12,
    color: '#4ECDC4',
    fontWeight: '500',
  },
  faqAnswer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  answerText: {
    fontSize: 14,
    color: '#636E72',
    lineHeight: 22,
    marginBottom: 12,
  },
  helpfulButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  helpfulText: {
    fontSize: 13,
    color: '#636E72',
    fontWeight: '500',
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#fff',
    borderRadius: 14,
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#636E72',
    textAlign: 'center',
  },
  needHelpCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  needHelpTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3436',
    marginTop: 16,
    marginBottom: 8,
  },
  needHelpText: {
    fontSize: 14,
    color: '#636E72',
    textAlign: 'center',
    marginBottom: 24,
  },
  contactSupportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D3436',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#2D3436',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  contactSupportText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  quickLinks: {
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  quickLinkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  quickLinkText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#2D3436',
  },
  bottomSpacing: {
    height: 40,
  },
});