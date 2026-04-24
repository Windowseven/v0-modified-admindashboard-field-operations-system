import { http } from './httpClient'

export type HelpRequestType = 'help' | 'meeting' | 'assistance'
export type HelpRequestStatus = 'pending' | 'accepted' | 'rejected'

export interface ApiHelpRequest {
  id: string
  user_id: string
  type: HelpRequestType
  message: string
  status: HelpRequestStatus
  response_from?: string | null
  response_at?: string | null
  response_note?: string | null
  created_at: string
}

export const helpRequestService = {
  async getMine(): Promise<ApiHelpRequest[]> {
    const res = await http.get<any>('/help-requests')
    return res?.data?.helpRequests ?? res?.data?.data?.helpRequests ?? []
  },

  async create(type: HelpRequestType, message: string): Promise<ApiHelpRequest> {
    const res = await http.post<any>('/help-requests', { type, message })
    return res?.data?.helpRequest ?? res?.data?.data?.helpRequest
  },
}

