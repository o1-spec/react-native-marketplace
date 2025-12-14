import { StyleSheet, View } from 'react-native';
import Skeleton from './Skeleton';

export default function ProductCardSkeleton() {
  return (
    <View style={styles.container}>
      {/* Image Skeleton */}
      <Skeleton height={200} borderRadius={14} style={styles.image} />
      
      {/* Content */}
      <View style={styles.content}>
        {/* Condition Badge */}
        <Skeleton width={60} height={20} borderRadius={6} style={styles.badge} />
        
        {/* Title */}
        <Skeleton width="100%" height={16} style={styles.title} />
        <Skeleton width="80%" height={16} style={styles.titleSecond} />
        
        {/* Price & Location Row */}
        <View style={styles.row}>
          <Skeleton width={80} height={24} />
          <Skeleton width={40} height={20} borderRadius={10} />
        </View>
        
        {/* Location */}
        <Skeleton width="60%" height={14} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: '100%',
  },
  content: {
    padding: 12,
  },
  badge: {
    marginBottom: 8,
  },
  title: {
    marginBottom: 6,
  },
  titleSecond: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
});
