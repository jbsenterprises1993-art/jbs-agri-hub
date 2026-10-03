import React, { useMemo, useState } from 'react';
import { JBS_ECOSYSTEM } from '@/data/jbs-ecosystem';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Status = 'completed' | 'in_progress' | 'planned' | 'blocked';

type Task = {
  id: string;
  name: string;
  status: Status;
};

type AppModule = {
  id: string;
  name: string;
  tamil: string;
  tasks: Task[];
};

const initialModules = JBS_ECOSYSTEM;

const statusLabel: Record<Status, string> = {
  completed: 'Completed',
  in_progress: 'In Progress',
  planned: 'Planned',
  blocked: 'Blocked',
};

function moduleProgress(module: AppModule) {
  if (!module.tasks.length) return 0;
  return Math.round(
    (module.tasks.filter((task) => task.status === 'completed').length /
      module.tasks.length) *
      100,
  );
}

export default function LiveProgressScreen() {
  const [filter, setFilter] = useState<'all' | Status>('all');
  const modules = initialModules;
  const [lastSynced, setLastSynced] = useState(new Date());

  const totals = useMemo(() => {
    const tasks = modules.flatMap((item) => item.tasks);
    const completed = tasks.filter((task) => task.status === 'completed').length;
    return { total: tasks.length, completed };
  }, [modules]);

  const overall = totals.total
    ? Math.round((totals.completed / totals.total) * 100)
    : 0;

  const visibleModules = modules.filter((module) => {
    if (filter === 'all') return true;
    return module.tasks.some((task) => task.status === filter);
  });

  const refresh = () => setLastSynced(new Date());

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.eyebrow}>JBS ECOSYSTEM</Text>
            <Text style={styles.title}>Live Progress</Text>
            <Text style={styles.subtitle}>Apps வேலை நிலை / Development status</Text>
          </View>
          <Pressable style={styles.refresh} onPress={refresh}>
            <Text style={styles.refreshText}>↻</Text>
          </Pressable>
        </View>

        <View style={styles.hero}>
          <View style={styles.ring}>
            <Text style={styles.percent}>{overall}%</Text>
            <Text style={styles.ringLabel}>OVERALL</Text>
          </View>
          <View style={styles.heroCopy}>
            <Text style={styles.heroTitle}>JBS Ecosystem</Text>
            <Text style={styles.heroText}>
              {totals.completed} of {totals.total} tracked tasks completed
            </Text>
            <Text style={styles.sync}>Last sync: {lastSynced.toLocaleTimeString()}</Text>
          </View>
        </View>

        <View style={styles.filters}>
          {(['all', 'in_progress', 'completed', 'planned', 'blocked'] as const).map((item) => (
            <Pressable
              key={item}
              onPress={() => setFilter(item)}
              style={[styles.filter, filter === item && styles.filterActive]}
            >
              <Text style={[styles.filterText, filter === item && styles.filterTextActive]}>
                {item === 'all' ? 'All' : statusLabel[item]}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionTitle}>All JBS Apps</Text>

        {visibleModules.map((module) => {
          const progress = moduleProgress(module);
          const inProgress = module.tasks.find((task) => task.status === 'in_progress');
          const completed = module.tasks.filter((task) => task.status === 'completed').length;

          return (
            <View key={module.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.appIcon}>
                  <Text style={styles.appIconText}>J</Text>
                </View>
                <View style={styles.appNameWrap}>
                  <Text style={styles.appName}>{module.name}</Text>
                  <Text style={styles.appTamil}>{module.tamil}</Text>
                </View>
                <Text style={styles.cardPercent}>{progress}%</Text>
              </View>

              <View style={styles.track}>
                <View style={[styles.fill, { width: `${progress}%` }]} />
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.meta}>{completed}/{module.tasks.length} tasks</Text>
                <Text style={styles.meta}>
                  {progress === 100 ? 'Completed' : inProgress ? 'In Progress' : 'Planned'}
                </Text>
              </View>

              {inProgress && (
                <View style={styles.action}>
                  <Text style={styles.actionText}>Status comes from JBS ecosystem source</Text>
                </View>
              )}
            </View>
          );
        })}

        <View style={styles.info}>
          <Text style={styles.infoTitle}>How percentage works</Text>
          <Text style={styles.infoText}>
            Percentage = Completed tracked tasks ÷ Total tracked tasks × 100.
            இது development task progress மட்டும்; business sales percentage அல்ல.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#071A12' },
  container: { padding: 18, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  eyebrow: { color: '#6ED99A', fontSize: 11, fontWeight: '900', letterSpacing: 2 },
  title: { color: '#FFFFFF', fontSize: 30, fontWeight: '900', marginTop: 3 },
  subtitle: { color: '#A8D5B5', marginTop: 4, fontSize: 13 },
  refresh: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#163B28', alignItems: 'center', justifyContent: 'center' },
  refreshText: { color: '#FFFFFF', fontSize: 25 },
  hero: { backgroundColor: '#102A1D', borderRadius: 24, padding: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  ring: { width: 112, height: 112, borderRadius: 56, borderWidth: 10, borderColor: '#20A653', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0A2116' },
  percent: { color: '#FFFFFF', fontSize: 27, fontWeight: '900' },
  ringLabel: { color: '#7FA98C', fontSize: 9, fontWeight: '900', marginTop: 2 },
  heroCopy: { flex: 1, marginLeft: 18 },
  heroTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '900' },
  heroText: { color: '#C9D8CE', fontSize: 13, marginTop: 7, lineHeight: 19 },
  sync: { color: '#7FA98C', fontSize: 10, marginTop: 8 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  filter: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, backgroundColor: '#102A1D' },
  filterActive: { backgroundColor: '#20A653' },
  filterText: { color: '#A8D5B5', fontSize: 11, fontWeight: '800' },
  filterTextActive: { color: '#FFFFFF' },
  sectionTitle: { color: '#FFFFFF', fontSize: 19, fontWeight: '900', marginBottom: 10 },
  card: { backgroundColor: '#102A1D', borderRadius: 20, padding: 16, marginBottom: 12 },
  cardTop: { flexDirection: 'row', alignItems: 'center' },
  appIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#20A653', alignItems: 'center', justifyContent: 'center' },
  appIconText: { color: '#FFFFFF', fontSize: 21, fontWeight: '900' },
  appNameWrap: { flex: 1, marginLeft: 12 },
  appName: { color: '#FFFFFF', fontSize: 15, fontWeight: '900' },
  appTamil: { color: '#86A995', fontSize: 11, marginTop: 2 },
  cardPercent: { color: '#6ED99A', fontSize: 18, fontWeight: '900' },
  track: { height: 7, backgroundColor: '#183A27', borderRadius: 6, marginTop: 15, overflow: 'hidden' },
  fill: { height: 7, backgroundColor: '#20A653', borderRadius: 6 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 9 },
  meta: { color: '#8EAE99', fontSize: 10, fontWeight: '700' },
  action: { marginTop: 12, backgroundColor: '#163B28', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  actionText: { color: '#BDE8CA', fontSize: 11, fontWeight: '800' },
  info: { backgroundColor: '#0D2418', borderRadius: 18, padding: 16, marginTop: 6 },
  infoTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '900' },
  infoText: { color: '#8EAE99', fontSize: 11, lineHeight: 17, marginTop: 6 },
});
