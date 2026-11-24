---
locale: zh-CN
---
# TeamoRouter

把渠道接到 [TeamoRouter](https://teamorouter.com)，一个 TeamoRouter API Key 就能调用 GPT、Claude、Gemini、DeepSeek、GLM、Kimi、MiniMax、Grok、豆包等模型。请求按原格式透传：OpenAI Chat Completions、OpenAI Responses、Anthropic Messages、Gemini 和 OpenAI Images。

## 渠道设置

- 渠道类型选任务插件 (61)，并绑定 TeamoRouter 插件。
- 密钥填 TeamoRouter 的 API Key，以 `sk-teamo-` 开头，在 [TeamoRouter 控制台](https://teamorouter.com) 创建。添加多个密钥时每行一个。
- API 地址留空时使用 `https://api.teamorouter.com`。
- 点「获取模型」加载这个密钥可用的模型，再留下要提供给用户的模型。
- 渠道余额显示这个密钥的可用余额，单位为美元。

## 模型与接口

模型列表来自 TeamoRouter 针对你的密钥返回的 `GET /v1/models`，TeamoRouter 上新的模型在下次获取模型列表时出现。带说明的完整列表见 [TeamoRouter 模型页](https://teamorouter.com/models)。

| 接口 | 常用模型 |
| --- | --- |
| `POST /v1/chat/completions` | 所有对话模型，例如 `deepseek-v4-flash`、`glm-5.3`、`kimi-k3.1-pro`、`claude-sonnet-5-5`、`gpt-5.4` |
| `POST /v1/responses` | GPT 模型，例如 `gpt-5.4-mini` |
| `POST /v1/messages` | Claude 模型，例如 `claude-haiku-5-5` |
| `POST /v1beta/models/{model}:generateContent` 和 `:streamGenerateContent` | Gemini 模型，例如 `gemini-3.5-flash` |
| `POST /v1/images/generations`、`POST /v1/images/edits` | 图片模型，例如 `gpt-image-2` |

所有文本接口都支持流式输出。

## 计费

插件不带价格表。网关按 TeamoRouter 返回的 token 用量，像其他渠道一样计费。给用户启用某个模型前，先为它设置模型价格或倍率。

TeamoRouter 按其模型页上的价格从渠道密钥扣费。

## 示例

```bash
curl https://your-gateway.example.com/v1/chat/completions \
  -H "Authorization: Bearer sk-..." \
  -H "Content-Type: application/json" \
  -d '{"model": "deepseek-v4-flash", "messages": [{"role": "user", "content": "Hello"}]}'
```

## 限制

- 发往 TeamoRouter 的请求带有请求头 `X-Client-Source: new-api-teamorouter-plugin`，方便 TeamoRouter 客服识别经这个插件来的请求。插件不发送你的网关或用户的其他信息。
- 密钥余额用完后请求会失败，请到 TeamoRouter 网站充值。
