import { StyleSheet, View } from 'react-native';
import Skeleton from './Skeleton';

export default function NotificationCardSkeleton() {
  return (
    <View style={styles.container}>
      {/* Icon/Avatar */}
      <Skeleton width={48} height={48} borderRadius={24} />
      
      {/* Content */}
      <View style={styles.content}>
        <Skeleton width="90%" height={15} style={styles.title} />
        <Skeleton width="100%" height={14} style={styles.message} />
        <Skeleton width="70%" height={14} style={styles.messageSecond} />
        <Skeleton width={60} height={12} />
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
    marginTop: 12,
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
  title: {
    marginBottom: 4,
  },
  message: {
    marginBottom: 2,
  },
  messageSecond: {
    marginBottom: 6,
  },
});
