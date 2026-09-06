import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Linking, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { DatePickerField } from '@/components/ui/date-picker-field';
import { Tappable } from '@/components/ui/tappable';
import { Palette, Radius, Shadow } from '@/constants/palette';
import { ApplicationStatus, useApplications } from '@/context/applications-context';

const stages: ApplicationStatus[] = ['Applied', 'Screening', 'Interview', 'Follow-up', 'Offer'];

const stageIndex = (status: ApplicationStatus) => stages.indexOf(status);

function TaskRow({ task, index, onToggle, onView, onEdit, onDelete }: any) {
  const check = useSharedValue(task.completed ? 1 : 0);
  const style = useAnimatedStyle(() => ({ opacity: check.value }));
  const toggle = () => {
    check.value = withTiming(task.completed ? 0 : 1, { duration: 120 });
    onToggle();
  };
  return (
    <Animated.View entering={FadeInDown.delay(index * 45).duration(220)} style={styles.task}>
      <Tappable onPress={toggle} style={[styles.checkbox, task.completed && styles.checkboxDone]}>
        <Animated.View style={style}><Ionicons name="checkmark" size={14} color={Palette.paper} /></Animated.View>
      </Tappable>
      <Tappable onPress={onView} style={{ flex: 1 }}>
        <Text style={[styles.taskTitle, task.completed && styles.taskDone]}>{task.title}</Text>
        {task.due ? <Text style={styles.taskDue}>Due {task.due}</Text> : null}
      </Tappable>
      <Tappable onPress={onEdit} style={styles.taskAction}><Ionicons name="create-outline" size={16} color={Palette.clay} /></Tappable>
      <Tappable onPress={onDelete} style={styles.taskAction}><Ionicons name="trash-outline" size={16} color={Palette.rust} /></Tappable>
    </Animated.View>
  );
}

export default function ApplicationDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getApplication, updateStatus, toggleTask, addTask, updateTask, deleteTask, deleteApplication } = useApplications();
  const item = getApplication(id ?? '');
  const [taskModal, setTaskModal] = useState(false);
  const [taskMode, setTaskMode] = useState<'add' | 'view' | 'edit'>('add');
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDue, setTaskDue] = useState('');
  const [taskNotes, setTaskNotes] = useState('');

  if (!item) {
    return <View style={styles.empty}><Text style={styles.emptyTitle}>Application not found.</Text><Tappable onPress={() => router.replace('/applications')} style={styles.emptyButton}><Text style={styles.emptyButtonText}>Back to applications</Text></Tappable></View>;
  }

  const current = stageIndex(item.status);

  const openAddTask = () => {
    setSelectedTask(null);
    setTaskTitle('');
    setTaskDue('');
    setTaskNotes('');
    setTaskMode('add');
    setTaskModal(true);
  };

  const openViewTask = (task: any) => {
    setSelectedTask(task);
    setTaskTitle(task.title);
    setTaskDue(task.due ?? '');
    setTaskNotes(task.notes ?? '');
    setTaskMode('view');
    setTaskModal(true);
  };

  const openEditTask = (task: any) => {
    setSelectedTask(task);
    setTaskTitle(task.title);
    setTaskDue(task.due ?? '');
    setTaskNotes(task.notes ?? '');
    setTaskMode('edit');
    setTaskModal(true);
  };

  const saveTask = async () => {
    if (!taskTitle.trim()) return;
    if (taskMode === 'edit' && selectedTask) {
      await updateTask(item.id, selectedTask.id, {
        title: taskTitle.trim(),
        due: taskDue.trim() || undefined,
        notes: taskNotes.trim() || undefined,
      });
    } else {
      await addTask(item.id, taskTitle, taskDue, taskNotes);
    }
    setTaskModal(false);
  };

  const handleDeleteTask = (task: any) => {
    Alert.alert('Delete task?', 'This task will be removed from this application.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteTask(item.id, task.id) },
    ]);
  };

  const advance = async () => {
    if (item.status === 'Rejected') return;
    const next = stages[Math.min(current + 1, stages.length - 1)];
    if (next !== item.status) await updateStatus(item.id, next);
  };

  const handleDelete = () => {
    Alert.alert('Delete application?', 'This removes the application and its tasks from Koda.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await deleteApplication(item.id); router.replace('/applications'); } },
    ]);
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.duration(380)} style={styles.header}>
          <Tappable style={styles.back} onPress={() => router.back()}><Ionicons name="arrow-back" size={20} color={Palette.navy} /></Tappable>
          <Text style={styles.headerTitle}>Application</Text>
          <Tappable style={styles.more} onPress={handleDelete}><Ionicons name="trash-outline" size={18} color={Palette.rust} /></Tappable>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(60).duration(400)} style={styles.hero}>
          <Text style={styles.company}>{item.company}</Text>
          <Text style={styles.role}>{item.role}</Text>
          <Text style={styles.meta}>{[item.location, item.workSetup].filter(Boolean).join(' · ')}</Text>
        </Animated.View>

        {item.status !== 'Rejected' ? (
          <Animated.View entering={FadeInDown.delay(130).duration(400)} style={styles.progressCard}>
            <View style={styles.progressTop}><Text style={styles.progressLabel}>JOURNEY</Text><Text style={styles.currentStatus}>{item.status}</Text></View>
            <View style={styles.track}>
              {stages.map((stage, i) => <View key={stage} style={styles.trackItem}>
                <View style={[styles.dot, i <= current && styles.dotActive, i === current && styles.dotCurrent]} />
                {i < stages.length - 1 ? <View style={[styles.connector, i < current && styles.connectorActive]} /> : null}
              </View>)}
            </View>
            <View style={styles.labels}>{stages.map((stage) => <Text key={stage} style={styles.stageLabel}>{stage}</Text>)}</View>
            <Tappable style={styles.advance} onPress={advance}><Text style={styles.advanceText}>{current >= stages.length - 1 ? 'At final stage' : `Move to ${stages[current + 1]}`}</Text><Ionicons name="arrow-forward" size={15} color={Palette.paper} /></Tappable>
          </Animated.View>
        ) : (
          <View style={styles.rejected}><View style={styles.rejectedDot} /><Text style={styles.rejectedText}>Rejected</Text></View>
        )}

        <Text style={styles.section}>POSITION</Text>
        <Animated.View entering={FadeInDown.delay(190).duration(380)} style={styles.card}>
          {[
            ['Location', item.location || 'Not added', 'location-outline'],
            ['Date applied', item.dateApplied || 'Not added', 'calendar-outline'],
            ['Applied via', item.appliedVia || 'Not added', 'navigate-outline'],
            ['Salary expectation', item.salary || 'Not specified', 'cash-outline'],
            ['Contact', item.contact || 'Not added', 'person-outline'],
            ['Contact information', item.contactInfo || 'Not added', 'mail-outline'],
          ].map(([label, value, icon], i) => (
            <View key={String(label)} style={[styles.detail, i > 0 && styles.detailBorder]}>
              <Ionicons name={icon as any} size={16} color={Palette.clay} />
              <View style={{ flex: 1 }}><Text style={styles.detailLabel}>{label}</Text><Text style={styles.detailValue}>{value}</Text></View>
            </View>
          ))}
          {item.jobLink ? <Tappable style={styles.linkRow} onPress={() => Linking.openURL(item.jobLink)}><Ionicons name="link-outline" size={16} color={Palette.clay} /><Text style={styles.linkText}>Open job posting</Text><Ionicons name="open-outline" size={14} color={Palette.clay} /></Tappable> : null}
        </Animated.View>

        <Text style={styles.section}>NOTES</Text>
        <Animated.View entering={FadeInDown.delay(260).duration(380)} style={styles.note}><Ionicons name="document-text-outline" size={17} color={Palette.clay} /><Text style={styles.noteText}>{item.notes || 'No notes yet.'}</Text></Animated.View>

        <View style={styles.sectionHeader}><Text style={styles.section}>TASKS</Text><Text style={styles.taskCount}>{item.tasks.filter((t) => !t.completed).length} OPEN</Text></View>
        {item.tasks.map((task, i) => (
          <TaskRow
            key={task.id}
            task={task}
            index={i}
            onToggle={() => toggleTask(item.id, task.id)}
            onView={() => openViewTask(task)}
            onEdit={() => openEditTask(task)}
            onDelete={() => handleDeleteTask(task)}
          />
        ))}
        <Tappable style={styles.addTaskButton} onPress={openAddTask}>
          <Ionicons name="add" size={18} color={Palette.paper} />
          <Text style={styles.addTaskButtonText}>Add task</Text>
        </Tappable>

        <Tappable style={styles.edit} onPress={() => router.push(`/application/edit/${item.id}`)}><Ionicons name="create-outline" size={17} color={Palette.paper} /><Text style={styles.editText}>Edit application</Text></Tappable>
      </ScrollView>
      <Modal visible={taskModal} transparent animationType="fade" onRequestClose={() => setTaskModal(false)}>
        <KeyboardAvoidingView
          style={styles.modalBackdrop}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setTaskModal(false)} />
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalEyebrow}>{taskMode === 'add' ? 'NEW TASK' : taskMode === 'edit' ? 'EDIT TASK' : 'TASK'}</Text>
                <Text style={styles.modalTitle}>{taskMode === 'view' ? 'Task details' : taskMode === 'edit' ? 'Update this task' : 'Add a next move'}</Text>
              </View>
              <Tappable onPress={() => setTaskModal(false)} style={styles.modalClose}><Ionicons name="close" size={18} color={Palette.navy} /></Tappable>
            </View>
            {taskMode === 'view' ? (
              <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScrollContent}>
                <View style={styles.viewBlock}><Text style={styles.viewLabel}>TASK</Text><Text style={styles.viewValue}>{taskTitle}</Text></View>
                {taskDue ? <View style={styles.viewBlock}><Text style={styles.viewLabel}>DUE</Text><Text style={styles.viewValue}>{taskDue}</Text></View> : null}
                {taskNotes ? <View style={styles.viewBlock}><Text style={styles.viewLabel}>NOTES</Text><Text style={styles.viewValue}>{taskNotes}</Text></View> : null}
                <View style={styles.modalActions}>
                  <Tappable style={styles.modalSecondary} onPress={() => selectedTask && openEditTask(selectedTask)}><Ionicons name="create-outline" size={16} color={Palette.clay} /><Text style={styles.modalSecondaryText}>Edit</Text></Tappable>
                  <Tappable style={styles.modalDanger} onPress={() => { if (selectedTask) handleDeleteTask(selectedTask); setTaskModal(false); }}><Ionicons name="trash-outline" size={16} color={Palette.rust} /><Text style={styles.modalDangerText}>Delete</Text></Tappable>
                </View>
              </ScrollView>
            ) : (
              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.modalScrollContent}
                keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
              >
                <Text style={styles.fieldLabel}>TASK TITLE</Text>
                <TextInput value={taskTitle} onChangeText={setTaskTitle} placeholder="e.g. Prepare for interview" placeholderTextColor="#A29B91" style={styles.field} autoFocus />
                <DatePickerField label="DUE DATE" value={taskDue} onChange={setTaskDue} placeholder="Select due date" />
                <Text style={styles.fieldLabel}>NOTES</Text>
                <TextInput value={taskNotes} onChangeText={setTaskNotes} placeholder="Optional details..." placeholderTextColor="#A29B91" style={[styles.field, styles.notesField]} multiline />
                <Tappable style={[styles.modalSave, !taskTitle.trim() && styles.modalSaveDisabled]} onPress={saveTask} disabled={!taskTitle.trim()}>
                  <Text style={styles.modalSaveText}>{taskMode === 'edit' ? 'Save changes' : 'Create task'}</Text>
                </Tappable>
              </ScrollView>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:{flex:1,backgroundColor:Palette.paper}, content:{padding:22,paddingTop:24,paddingBottom:88},
  header:{flexDirection:'row',alignItems:'center',gap:12,marginBottom:12}, back:{width:42,height:42,borderRadius:15,backgroundColor:Palette.surface,alignItems:'center',justifyContent:'center',...Shadow.soft}, headerTitle:{flex:1,color:Palette.navy,fontSize:15,fontFamily:'Poppins_700Bold'},more:{width:42,height:42,alignItems:'center',justifyContent:'center'},
  hero:{alignItems:'center',paddingVertical:18},company:{color:Palette.navy,fontSize:23,fontFamily:'Poppins_700Bold'},role:{color:Palette.slate,fontSize:11.5,fontFamily:'Poppins_400Regular',marginTop:2},meta:{color:Palette.ash,fontSize:9.5,fontFamily:'Poppins_400Regular',marginTop:6},
  progressCard:{backgroundColor:Palette.ink,borderRadius:Radius.lg,padding:18,...Shadow.lifted},progressTop:{flexDirection:'row',justifyContent:'space-between'},progressLabel:{color:Palette.brassSoft,fontSize:8.5,fontFamily:'Poppins_700Bold',letterSpacing:1.4},currentStatus:{color:Palette.paper,fontSize:9.5,fontFamily:'Poppins_600SemiBold'},track:{flexDirection:'row',alignItems:'center',marginTop:18},trackItem:{flex:1,flexDirection:'row',alignItems:'center'},dot:{width:9,height:9,borderRadius:5,backgroundColor:'#52606A'},dotActive:{backgroundColor:Palette.brass},dotCurrent:{width:13,height:13,borderRadius:7,...Shadow.glow},connector:{height:2,flex:1,backgroundColor:'#52606A'},connectorActive:{backgroundColor:Palette.brass},labels:{flexDirection:'row',justifyContent:'space-between',marginTop:8},stageLabel:{color:'#AEB9C0',fontSize:7.5,fontFamily:'Poppins_500Medium'},advance:{marginTop:16,height:40,borderRadius:12,backgroundColor:Palette.brass,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:7},advanceText:{color:Palette.paper,fontSize:9.5,fontFamily:'Poppins_700Bold'},
  rejected:{backgroundColor:'#F1E7E3',paddingHorizontal:14,paddingVertical:9,borderRadius:18,alignSelf:'center',flexDirection:'row',gap:7,alignItems:'center'},rejectedDot:{width:6,height:6,borderRadius:3,backgroundColor:Palette.rust},rejectedText:{color:Palette.rust,fontSize:10,fontFamily:'Poppins_700Bold'},
  section:{color:Palette.ash2,fontSize:8.5,fontFamily:'Poppins_700Bold',letterSpacing:1.4,marginTop:24,marginBottom:10},card:{backgroundColor:Palette.surface,borderRadius:Radius.lg,padding:16,...Shadow.soft},detail:{flexDirection:'row',alignItems:'center',gap:12,paddingVertical:11},detailBorder:{borderTopWidth:1,borderTopColor:Palette.hairlineSoft},detailLabel:{color:Palette.ash,fontSize:8.5,fontFamily:'Poppins_500Medium'},detailValue:{color:Palette.navy,fontSize:10.5,fontFamily:'Poppins_600SemiBold',marginTop:2},linkRow:{flexDirection:'row',alignItems:'center',gap:8,paddingTop:13,marginTop:3,borderTopWidth:1,borderTopColor:Palette.hairlineSoft},linkText:{flex:1,color:Palette.clay,fontSize:10,fontFamily:'Poppins_600SemiBold'},note:{backgroundColor:Palette.surface,borderRadius:17,padding:16,flexDirection:'row',gap:10,...Shadow.soft},noteText:{flex:1,color:Palette.slate,fontSize:10.5,lineHeight:17,fontFamily:'Poppins_400Regular'},sectionHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},taskCount:{color:Palette.ash2,fontSize:8,fontFamily:'Poppins_700Bold',letterSpacing:1},task:{backgroundColor:Palette.surface,borderRadius:15,padding:13,marginBottom:8,flexDirection:'row',alignItems:'center',gap:9,...Shadow.soft},taskAction:{width:32,height:32,borderRadius:10,alignItems:'center',justifyContent:'center',backgroundColor:Palette.sandLight},checkbox:{width:28,height:28,borderRadius:10,borderWidth:1.5,borderColor:Palette.hairline,alignItems:'center',justifyContent:'center'},checkboxDone:{backgroundColor:Palette.moss,borderColor:Palette.moss},taskTitle:{color:Palette.navy,fontSize:11,fontFamily:'Poppins_600SemiBold'},taskDone:{textDecorationLine:'line-through',color:Palette.ash},taskDue:{color:Palette.ash,fontSize:8.5,fontFamily:'Poppins_400Regular',marginTop:2},addTaskButton:{height:46,borderRadius:14,backgroundColor:Palette.sandLight,marginTop:4,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:7,borderWidth:1,borderColor:Palette.hairlineSoft},addTaskButtonText:{color:Palette.clay,fontSize:10.5,fontFamily:'Poppins_700Bold'},edit:{height:50,borderRadius:15,backgroundColor:Palette.ink,marginTop:18,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,...Shadow.soft},editText:{color:Palette.paper,fontSize:11.5,fontFamily:'Poppins_700Bold'},modalBackdrop:{flex:1,backgroundColor:'rgba(20,33,45,0.42)',justifyContent:'flex-end'},modalCard:{backgroundColor:Palette.paper,borderTopLeftRadius:26,borderTopRightRadius:26,padding:22,paddingBottom:24,maxHeight:'92%',...Shadow.lifted},modalHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:14},modalScrollContent:{paddingBottom:8},modalEyebrow:{color:Palette.brass,fontSize:8.5,fontFamily:'Poppins_700Bold',letterSpacing:1.4},modalTitle:{color:Palette.navy,fontSize:19,fontFamily:'Poppins_700Bold',marginTop:3},modalClose:{width:38,height:38,borderRadius:13,backgroundColor:Palette.surface,alignItems:'center',justifyContent:'center'},fieldLabel:{color:Palette.ash2,fontSize:8,fontFamily:'Poppins_700Bold',letterSpacing:1.1,marginTop:10,marginBottom:6},field:{minHeight:46,borderRadius:13,borderWidth:1,borderColor:Palette.hairlineSoft,backgroundColor:Palette.surface,paddingHorizontal:13,color:Palette.navy,fontSize:11,fontFamily:'Poppins_400Regular',outlineStyle:'none'} as any,notesField:{height:78,paddingTop:12,textAlignVertical:'top'},modalSave:{height:48,borderRadius:14,backgroundColor:Palette.ink,alignItems:'center',justifyContent:'center',marginTop:18},modalSaveDisabled:{opacity:0.45},modalSaveText:{color:Palette.paper,fontSize:11,fontFamily:'Poppins_700Bold'},viewBlock:{paddingVertical:10,borderBottomWidth:1,borderBottomColor:Palette.hairlineSoft},viewLabel:{color:Palette.ash2,fontSize:8,fontFamily:'Poppins_700Bold',letterSpacing:1.1},viewValue:{color:Palette.navy,fontSize:11.5,lineHeight:18,fontFamily:'Poppins_500Medium',marginTop:4},modalActions:{flexDirection:'row',gap:10,marginTop:18},modalSecondary:{flex:1,height:44,borderRadius:13,backgroundColor:Palette.sandLight,alignItems:'center',justifyContent:'center',flexDirection:'row',gap:6},modalSecondaryText:{color:Palette.clay,fontSize:10.5,fontFamily:'Poppins_700Bold'},modalDanger:{flex:1,height:44,borderRadius:13,backgroundColor:'#F1E7E3',alignItems:'center',justifyContent:'center',flexDirection:'row',gap:6},modalDangerText:{color:Palette.rust,fontSize:10.5,fontFamily:'Poppins_700Bold'},empty:{flex:1,alignItems:'center',justifyContent:'center',padding:30,backgroundColor:Palette.paper},emptyTitle:{color:Palette.navy,fontSize:17,fontFamily:'Poppins_700Bold'},emptyButton:{marginTop:16,backgroundColor:Palette.ink,padding:13,borderRadius:14},emptyButtonText:{color:Palette.paper,fontFamily:'Poppins_600SemiBold',fontSize:10},
});
