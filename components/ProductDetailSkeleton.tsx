import { Dimensions, StyleSheet, View } from 'react-native';
import Skeleton from './Skeleton';

const { width } = Dimensions.get('window');

export default function ProductDetailSkeleton() {
  return (
    <View style={styles.container}>
      {/* Image Skeleton */}
      <Skeleton width={width} height={400} borderRadius={0} />
      
      {/* Info Container */}
      <View style={styles.infoContainer}>
        {/* Price */}
        <Skeleton width={120} height={28} style={styles.price} />
        
        {/* Title */}
        <Skeleton width="100%" height={20} style={styles.title} />
        <Skeleton width="80%" height={20} style={styles.titleSecond} />
        
        {/* Meta Info */}
        <View style={styles.metaRow}>
          <Skeleton width={100} height={14} />
          <Skeleton width={80} height={14} />
        </View>
        
        {/* Category Tag */}
        <Skeleton width={90} height={28} borderRadius={8} />
      </View>
      
      {/* Seller Container */}
      <View style={styles.sellerContainer}>
        <View style={styles.sellerLeft}>
          <Skeleton width={56} height={56} borderRadius={28} />
          <View style={styles.sellerInfo}>
            <Skeleton width={120} height={16} style={styles.sellerName} />
            <Skeleton width={80} height={13} style={styles.rating} />
            <Skeleton width={100} height={12} />
          </View>
        </View>
      </View>
      
      {/* Description Container */}
      <View style={styles.descriptionContainer}>
        <Skeleton width={100} height={18} style={styles.sectionTitle} />
        <Skeleton width="100%" height={15} style={styles.descLine} />
        <Skeleton width="100%" height={15} style={styles.descLine} />
        <Skeleton width="100%" height={15} style={styles.descLine} />
        <Skeleton width="80%" height={15} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
  },
  price: {
    marginBottom: 8,
  },
  title: {
    marginBottom: 6,
  },
  titleSecond: {
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  sellerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: 8,
    padding: 20,
  },
  sellerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sellerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  sellerName: {
    marginBottom: 4,
  },
  rating: {
    marginBottom: 2,
  },
  descriptionContainer: {
    backgroundColor: '#fff',
    marginTop: 8,
    padding: 20,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  descLine: {
    marginBottom: 8,
  },
});
