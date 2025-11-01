export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      competitions: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      match_events: {
        Row: {
          assisting_player_id: number | null
          away_score_after: number | null
          event_type: string
          home_score_after: number | null
          id: number
          is_home_team: boolean | null
          match_id: number
          minute: number | null
          raw_text: string | null
          scoring_player_id: number | null
          sub_player_in_id: number | null
          sub_player_out_id: number | null
        }
        Insert: {
          assisting_player_id?: number | null
          away_score_after?: number | null
          event_type: string
          home_score_after?: number | null
          id?: number
          is_home_team?: boolean | null
          match_id: number
          minute?: number | null
          raw_text?: string | null
          scoring_player_id?: number | null
          sub_player_in_id?: number | null
          sub_player_out_id?: number | null
        }
        Update: {
          assisting_player_id?: number | null
          away_score_after?: number | null
          event_type?: string
          home_score_after?: number | null
          id?: number
          is_home_team?: boolean | null
          match_id?: number
          minute?: number | null
          raw_text?: string | null
          scoring_player_id?: number | null
          sub_player_in_id?: number | null
          sub_player_out_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "match_events_assisting_player_id_fkey"
            columns: ["assisting_player_id"]
            isOneToOne: false
            referencedRelation: "player_advanced_summary"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "match_events_assisting_player_id_fkey"
            columns: ["assisting_player_id"]
            isOneToOne: false
            referencedRelation: "player_overview"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "match_events_assisting_player_id_fkey"
            columns: ["assisting_player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_events_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_events_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "player_match_timeline"
            referencedColumns: ["match_id"]
          },
          {
            foreignKeyName: "match_events_scoring_player_id_fkey"
            columns: ["scoring_player_id"]
            isOneToOne: false
            referencedRelation: "player_advanced_summary"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "match_events_scoring_player_id_fkey"
            columns: ["scoring_player_id"]
            isOneToOne: false
            referencedRelation: "player_overview"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "match_events_scoring_player_id_fkey"
            columns: ["scoring_player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_events_sub_player_in_id_fkey"
            columns: ["sub_player_in_id"]
            isOneToOne: false
            referencedRelation: "player_advanced_summary"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "match_events_sub_player_in_id_fkey"
            columns: ["sub_player_in_id"]
            isOneToOne: false
            referencedRelation: "player_overview"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "match_events_sub_player_in_id_fkey"
            columns: ["sub_player_in_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_events_sub_player_out_id_fkey"
            columns: ["sub_player_out_id"]
            isOneToOne: false
            referencedRelation: "player_advanced_summary"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "match_events_sub_player_out_id_fkey"
            columns: ["sub_player_out_id"]
            isOneToOne: false
            referencedRelation: "player_overview"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "match_events_sub_player_out_id_fkey"
            columns: ["sub_player_out_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          awarded: boolean
          cancelled: boolean
          competition_id: number | null
          display_tournament: boolean
          finished: boolean
          goal_diff: number | null
          id: number
          kickoff_utc: string | null
          opponent_name: string
          opponent_score: number
          possession_pct: number | null
          reason_long: string | null
          reason_short: string | null
          result_char: string | null
          score_string: string | null
          started: boolean
          usa_score: number
        }
        Insert: {
          awarded?: boolean
          cancelled?: boolean
          competition_id?: number | null
          display_tournament?: boolean
          finished?: boolean
          goal_diff?: number | null
          id: number
          kickoff_utc?: string | null
          opponent_name: string
          opponent_score: number
          possession_pct?: number | null
          reason_long?: string | null
          reason_short?: string | null
          result_char?: string | null
          score_string?: string | null
          started?: boolean
          usa_score: number
        }
        Update: {
          awarded?: boolean
          cancelled?: boolean
          competition_id?: number | null
          display_tournament?: boolean
          finished?: boolean
          goal_diff?: number | null
          id?: number
          kickoff_utc?: string | null
          opponent_name?: string
          opponent_score?: number
          possession_pct?: number | null
          reason_long?: string | null
          reason_short?: string | null
          result_char?: string | null
          score_string?: string | null
          started?: boolean
          usa_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "matches_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
        ]
      }
      player_match_stats: {
        Row: {
          accurate_passes: number | null
          aerial_duels_total: number | null
          aerial_duels_won: number | null
          assists: number | null
          blocks: number | null
          chances_created: number | null
          clearances: number | null
          fouled: number | null
          fouls_committed: number | null
          goals: number | null
          ground_duels_total: number | null
          ground_duels_won: number | null
          id: number
          interceptions: number | null
          match_id: number
          match_rating: number | null
          minutes_played: number | null
          player_id: number
          recoveries: number | null
          shots_on_target: number | null
          tackles: number | null
          total_passes: number | null
          total_shots: number | null
          touches: number | null
          touches_in_box: number | null
        }
        Insert: {
          accurate_passes?: number | null
          aerial_duels_total?: number | null
          aerial_duels_won?: number | null
          assists?: number | null
          blocks?: number | null
          chances_created?: number | null
          clearances?: number | null
          fouled?: number | null
          fouls_committed?: number | null
          goals?: number | null
          ground_duels_total?: number | null
          ground_duels_won?: number | null
          id?: number
          interceptions?: number | null
          match_id: number
          match_rating?: number | null
          minutes_played?: number | null
          player_id: number
          recoveries?: number | null
          shots_on_target?: number | null
          tackles?: number | null
          total_passes?: number | null
          total_shots?: number | null
          touches?: number | null
          touches_in_box?: number | null
        }
        Update: {
          accurate_passes?: number | null
          aerial_duels_total?: number | null
          aerial_duels_won?: number | null
          assists?: number | null
          blocks?: number | null
          chances_created?: number | null
          clearances?: number | null
          fouled?: number | null
          fouls_committed?: number | null
          goals?: number | null
          ground_duels_total?: number | null
          ground_duels_won?: number | null
          id?: number
          interceptions?: number | null
          match_id?: number
          match_rating?: number | null
          minutes_played?: number | null
          player_id?: number
          recoveries?: number | null
          shots_on_target?: number | null
          tackles?: number | null
          total_passes?: number | null
          total_shots?: number | null
          touches?: number | null
          touches_in_box?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "player_match_stats_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_match_stats_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "player_match_timeline"
            referencedColumns: ["match_id"]
          },
          {
            foreignKeyName: "player_match_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_advanced_summary"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_match_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_overview"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_match_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          first_name: string | null
          full_name: string
          id: number
          last_name: string | null
          position: string | null
        }
        Insert: {
          first_name?: string | null
          full_name: string
          id: number
          last_name?: string | null
          position?: string | null
        }
        Update: {
          first_name?: string | null
          full_name?: string
          id?: number
          last_name?: string | null
          position?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      player_advanced_summary: {
        Row: {
          avg_match_rating: number | null
          chances_created_per_90: number | null
          duel_win_pct: number | null
          full_name: string | null
          goal_involvements_per_90: number | null
          interceptions_per_90: number | null
          matches_played: number | null
          minutes_per_match: number | null
          pass_completion_pct: number | null
          passes_per_90: number | null
          pct_matches_with_goal_contrib: number | null
          player_id: number | null
          position: string | null
          tackles_per_90: number | null
          total_assists: number | null
          total_goals: number | null
          total_minutes: number | null
        }
        Relationships: []
      }
      player_match_timeline: {
        Row: {
          accurate_passes: number | null
          competition_id: number | null
          def_actions_per_90: number | null
          interceptions: number | null
          kickoff_utc: string | null
          match_id: number | null
          match_rating: number | null
          minutes_played: number | null
          opponent_name: string | null
          pass_completion_pct: number | null
          player_id: number | null
          shots_on_target: number | null
          tackles: number | null
          total_passes: number | null
          total_shots: number | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_match_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_advanced_summary"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_match_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_overview"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_match_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      player_overview: {
        Row: {
          avg_match_rating: number | null
          full_name: string | null
          interceptions_per_90: number | null
          pass_completion_pct: number | null
          player_id: number | null
          position: string | null
          tackles_per_90: number | null
          total_assists: number | null
          total_goals: number | null
          total_minutes: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
