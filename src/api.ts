import { invoke } from "@tauri-apps/api/core"
import type { Customer, CreateCustomer, Deal, CreateDeal, FollowUp, CreateFollowUp, Transaction, CreateTransaction, DashboardStats } from "./types"

export async function createCustomer(userId: string, data: CreateCustomer): Promise<Customer> {
  return invoke("create_customer", { customer: data, userId: userId })
}

export async function getCustomers(userId: string): Promise<Customer[]> {
  return invoke("get_customers", { userId: userId })
}

export async function getCustomer(id: string): Promise<Customer | null> {
  return invoke("get_customer", { id: id })
}

export async function createDeal(userId: string, data: CreateDeal): Promise<Deal> {
  return invoke("create_deal", { deal: data, userId: userId })
}

export async function getDeals(userId: string): Promise<Deal[]> {
  return invoke("get_deals", { userId: userId })
}

export async function createFollowUp(userId: string, data: CreateFollowUp): Promise<FollowUp> {
  return invoke("create_follow_up", { followUp: data, userId: userId })
}

export async function getFollowUps(userId: string): Promise<FollowUp[]> {
  return invoke("get_follow_ups", { userId: userId })
}

export async function getTodayFollowUps(userId: string): Promise<FollowUp[]> {
  return invoke("get_today_follow_ups", { userId: userId })
}

export async function completeFollowUp(id: string): Promise<void> {
  return invoke("complete_follow_up", { id: id })
}

export async function createTransaction(userId: string, data: CreateTransaction): Promise<Transaction> {
  return invoke("create_transaction", { transaction: data, userId: userId })
}

export async function getTransactions(userId: string): Promise<Transaction[]> {
  return invoke("get_transactions", { userId: userId })
}

export async function getTransactionsSummary(userId: string): Promise<[number, number, number]> {
  return invoke("get_transactions_summary", { userId: userId })
}

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  return invoke("get_dashboard_stats", { userId: userId })
}
