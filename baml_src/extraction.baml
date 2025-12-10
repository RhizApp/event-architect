class PartialEventDetails {
  eventName string? @description("Name of the event found in the image")
  eventDate string? @description("Date and time of the event")
  eventLocation string? @description("Location or venue of the event")
  description string? @description("Brief description of what the event is about")
  vibe string? @description("Inferred vibe or tone (e.g. professional, party, workshop)")
}

function ExtractEventDetails(image: image) -> PartialEventDetails {
  client Gemini
  prompt #"
    Analyze this event flyer/image and extract the key details.
    
    {{ image }}

    If a field is not clearly present, leave it null.
    
    {{ ctx.output_format }}
  "#
}
