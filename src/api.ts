import { invoke } from "@tauri-apps/api/core"
import type { Customer, CreateCustomer, Deal, CreateDeal, FollowUp, CreateFollowUp, Transaction, CreateTransaction, DashboardStats } from "./types"

export async function createCustomer(data: CreateCustomer): Promise<Customer> {
  return invoke("create_customer", { customer: data })
}

export async function getCustomers(): Promise<Customer[]> {
  return invoke("get_customers")
}

export async function getCustomer(id: string): Promise<Customer | null> {
  return invoke("get_customer", { id })
}

export async function createDeal(data: CreateDeal): Promise<Deal> {
  return invoke("create_deal", { deal: data })
}

export async function getDeals(): Promise<Deal[]> {
  return invoke("get_deals")
}

export async function createFollowUp(data: CreateFollowUp): Promise<FollowUp> {
  return invoke("create_follow_up", { followUp: data })
}

export async function getFollowUps(): Promise<FollowUp[]> {
  return invoke("get_follow_ups")
}

export async function getTodayFollowUps(): Promise<FollowUp[]> {
  return invoke("get_today_follow_ups")
}

export async function completeFollowUp(id: string): Promise<void> {
  return invoke("complete_follow_up", { id })
}

export async function createTransaction(data: CreateTransaction): Promise<Transaction> {
  return invoke("create_transaction", { transaction: data })
}

export async function getTransactions(): Promise<Transaction[]> {
  return invoke("get_transactions")
}

export async function getTransactionsSummary(): Promise<[number, number, number]> {
  return invoke("get_transactions_summary")
}

export async function getDashboardStats(): Promise<DashboardStats> {
  return invoke("get_dashboard_stats")
}
