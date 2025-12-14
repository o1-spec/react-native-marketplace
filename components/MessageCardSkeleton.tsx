import { StyleSheet, View } from 'react-native';
import Skeleton from './Skeleton';

export default function MessageCardSkeleton() {
  return (
    <View style={styles.container}>
      {/* Avatar */}
      <Skeleton width={56} height={56} borderRadius={28} />
      
      {/* Content */}
      <View style={styles.content}>
        {/* Name and Time */}
        <View style={styles.header}>
          <Skeleton width={120} height={16} />
          <Skeleton width={50} height={12} />
        </View>
        
        {/* Product Preview */}
        <View style={styles.productPreview}>
          <Skeleton width={32} height={32} borderRadius={6} />
          <Skeleton width={150} height={12} style={styles.productText} />
        </View>
        
        {/* Message */}
        <Skeleton width="100%" height={14} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    gap: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  productPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
    gap: 8,
  },
  productText: {
    flex: 1,
  },
});
