client<llm> GPT4 {
  provider openai
  options {
    model "gpt-4-turbo"
    api_key env.OPENAI_API_KEY
  }
}

client<llm> Gemini {
  provider google-ai
  options {
    model "gemini-1.5-flash"
    api_key env.GOOGLE_API_KEY
  }
}
