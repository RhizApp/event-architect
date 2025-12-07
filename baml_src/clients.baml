client<llm> GPT4 {
  provider openai
  options {
    model "gpt-4-turbo"
    api_key env.OPENAI_API_KEY
  }
}
