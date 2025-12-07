class ConnectionReason {
  reasonSummary string
  talkingPoints string[]
}

function GenerateConnectionReason(
  attendeeA: string,
  attendeeB: string,
  sharedTags: string[],
  sharedIntents: string[]
) -> ConnectionReason {
  client GPT4
  prompt #"
    <instructions>
    Analyze the profiles of two attendees and determine the strongest reasons for them to connect.
    Generate a connection summary and talking points to facilitate their interaction.
    </instructions>

    <data>
      <attendee_a>
        {{ attendeeA }}
      </attendee_a>
      
      <attendee_b>
        {{ attendeeB }}
      </attendee_b>
      
      <shared_context>
        <tags>{{ sharedTags }}</tags>
        <intents>{{ sharedIntents }}</intents>
      </shared_context>
    </data>

    <output_requirements>
    Output a concise summary (1-2 sentences) and 3 bullet points for conversation starters.
    </output_requirements>
  "#
}
