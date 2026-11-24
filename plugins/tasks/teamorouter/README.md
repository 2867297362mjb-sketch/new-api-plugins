---
translations:
  zh-CN: README.zh-CN.md
---
# TeamoRouter

Connects a channel to [TeamoRouter](https://teamorouter.com), so one TeamoRouter API key serves GPT, Claude, Gemini, DeepSeek, GLM, Kimi, MiniMax, Grok, Doubao and other models. Requests pass through in their own format: OpenAI Chat Completions, OpenAI Responses, Anthropic Messages, Gemini and OpenAI Images.

## Channel setup

- Choose the Task Plugin (61) channel type and bind the TeamoRouter plugin.
- The key is a TeamoRouter API key, starting with `sk-teamo-`. Create one in the [TeamoRouter console](https://teamorouter.com). Put one key per line to add several.
- Leave the API address empty to use `https://api.teamorouter.com`.
- Click "Fetch Models" to load the models your key can use, then keep the ones you want to offer.
- The channel balance shows the available balance of the key in USD.

## Models and endpoints

The model list comes from TeamoRouter's `GET /v1/models` for your key, so new TeamoRouter models appear the next time you fetch models. The full list with descriptions is on the [TeamoRouter models page](https://teamorouter.com/models).

| Endpoint | Typical models |
| --- | --- |
| `POST /v1/chat/completions` | Every chat model, such as `deepseek-v4-flash`, `glm-5.3`, `kimi-k3.1-pro`, `claude-sonnet-5-5`, `gpt-5.4` |
| `POST /v1/responses` | GPT models, such as `gpt-5.4-mini` |
| `POST /v1/messages` | Claude models, such as `claude-haiku-5-5` |
| `POST /v1beta/models/{model}:generateContent` and `:streamGenerateContent` | Gemini models, such as `gemini-3.5-flash` |
| `POST /v1/images/generations`, `POST /v1/images/edits` | Image models, such as `gpt-image-2` |

Streaming works on every text endpoint.

## Billing

The plugin adds no price table. The gateway bills these requests like any other channel, on the token usage TeamoRouter reports. Set a model price or ratio for each model you offer before enabling it for users.

TeamoRouter charges the channel key at the prices on its models page.

## Example

```bash
curl https://your-gateway.example.com/v1/chat/completions \
  -H "Authorization: Bearer sk-..." \
  -H "Content-Type: application/json" \
  -d '{"model": "deepseek-v4-flash", "messages": [{"role": "user", "content": "Hello"}]}'
```

## Limits

- Requests to TeamoRouter carry the header `X-Client-Source: new-api-teamorouter-plugin`, so TeamoRouter support can identify requests that come through this plugin. The plugin sends nothing else about your gateway or your users.
- A request fails when the key's balance is used up. Top up on the TeamoRouter site.
