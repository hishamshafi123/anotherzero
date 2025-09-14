import { supabase } from './supabase'

export interface FollowupSequence {
  id: string
  name: string
  description: string
  trigger_type: string
  status: 'active' | 'paused' | 'draft'
  channel: string
  steps: any[]
  total_triggered: number
  in_progress: number
  completed: number
  conversion_rate: number
  confidence_level: number
  created_at: string
}

export interface FollowupExecution {
  id: string
  contact_id: string
  sequence_id: string
  current_step: number
  total_steps: number
  next_action_at: string
  status: string
  progress: number
  contact: {
    name: string
    handle: string
    source: string
    engagement_score: number
  }
  sequence: {
    name: string
  }
}

// Get all follow-up sequences
export async function getFollowupSequences(): Promise<FollowupSequence[]> {
  const { data, error } = await supabase
    .from('followup_sequences')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching sequences:', error)
    return []
  }
  
  return data || []
}

// Get current executions (people in sequences)
export async function getCurrentExecutions(): Promise<FollowupExecution[]> {
  const { data, error } = await supabase
    .from('followup_executions')
    .select(`
      *,
      contact:contacts(name, handle, source, engagement_score),
      sequence:followup_sequences(name)
    `)
    .eq('status', 'active')
    .order('next_action_at', { ascending: true })
    .limit(10)
  
  if (error) {
    console.error('Error fetching executions:', error)
    return []
  }
  
  return data || []
}

// Get follow-up stats
export async function getFollowupStats() {
  const [sequences, executions] = await Promise.all([
    getFollowupSequences(),
    getCurrentExecutions()
  ])
  
  const activeSequences = sequences.filter(s => s.status === 'active').length
  const totalInProgress = sequences.reduce((sum, s) => sum + s.in_progress, 0)
  const totalCompleted = sequences.reduce((sum, s) => sum + s.completed, 0)
  const totalTriggered = sequences.reduce((sum, s) => sum + s.total_triggered, 0)
  const avgCompletion = totalTriggered > 0 ? (totalCompleted / totalTriggered * 100) : 0
  const bestSequence = sequences.reduce((best, current) => 
    current.conversion_rate > best.conversion_rate ? current : best, sequences[0])

  return {
    activeSequences,
    contactsInFollowups: totalInProgress,
    averageCompletion: avgCompletion.toFixed(1),
    bestPerforming: bestSequence?.name || 'N/A',
    bestPerformingRate: bestSequence?.conversion_rate.toFixed(1) || '0'
  }
}