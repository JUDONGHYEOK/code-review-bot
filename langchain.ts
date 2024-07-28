import { Ollama } from '@langchain/community/llms/ollama';
import { PromptTemplate } from '@langchain/core/prompts';

const codellama = new Ollama({ model: 'codellama:13b', temperature: 0.1 });

const llama = new Ollama({ model: 'llama3.1', temperature: 0.1 });

const template = `
Please review the code below and provide your feedback on the following:
1. Ensure there are no runtime errors.
2. Check for any security vulnerabilities.
3. Suggest any performance improvements.
4. Include at least one compliment if possible.
Code:
\`\`\`{code}\`\`\`
Thank you.
`;

const translationTemplate = `
아래 지문들을한국말로 번역해주세요. 불필요한 말은 하지않고 딱 번역된 말만 해주세요.
{sentences}
`;

const translationPromptTemplate = new PromptTemplate({
  inputVariables: ['sentences'],
  template: translationTemplate,
});

const translatePrompt = translationPromptTemplate.pipe(llama);

const promptTemplate = new PromptTemplate({
  inputVariables: ['code'],
  template,
});
const prompt = promptTemplate.pipe(codellama);

export async function main(
  diff: string,
  owner: string,
  repo: string,
  pull_number: number
) {
  const review = await prompt.invoke({ code: diff });
  console.log(review);
  const response = await translatePrompt.invoke({ sentences: review });
  return response;
}
