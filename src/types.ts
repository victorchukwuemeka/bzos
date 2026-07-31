export interface Customer {
  id: string
  user_id: string
  name: string
  phone: string | null
  email: string | null
  notes: string | null
  tags: string | null
  budget_min: number | null
  budget_max: number | null
  source: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  sync_status: string
}

export interface CreateCustomer {
  name: string
  phone?: string
  email?: string
  notes?: string
  tags?: string[]
  budget_min?: number
  budget_max?: number
  source?: string
}

export interface Deal {
  id: string
  user_id: string
  customer_id: string | null
  title: string
  value: number | null
  currency: string
  status: string
  expected_close_date: string | null
  notes: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  sync_status: string
}

export interface CreateDeal {
  customer_id?: string
  title: string
  value?: number
  currency?: string
  status?: string
  expected_close_date?: string
  notes?: string
}

export interface FollowUp {
  id: string
  user_id: string
  customer_id: string | null
  deal_id: string | null
  type: string
  scheduled_at: string
  completed_at: string | null
  notes: string | null
  status: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  sync_status: string
}

export interface CreateFollowUp {
  customer_id?: string
  deal_id?: string
  type: string
  scheduled_at: string
  notes?: string
}

export interface Transaction {
  id: string
  user_id: string
  customer_id: string | null
  deal_id: string | null
  type: string
  amount: number
  currency: string
  description: string | null
  category: string | null
  payment_method: string | null
  is_credit: boolean
  due_date: string | null
  paid_at: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  sync_status: string
}

export interface CreateTransaction {
  customer_id?: string
  deal_id?: string
  type: string
  amount: number
  currency?: string
  description?: string
  category?: string
  payment_method?: string
  is_credit?: boolean
  due_date?: string
}

export interface DashboardStats {
  total_customers: number
  active_deals: number
  pipeline_value: number
  today_follow_ups: number
  total_sales: number
  total_expenses: number
  profit: number
  total_owed: number
}

export interface TransactionSummary {
  total_sales: number
  total_expenses: number
  profit: number
}
