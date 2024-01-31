import openAi from "./config/openai.js";
import readlineSync from "readline-sync";
import colors from "colors";

//Making request
async function main() {
  console.log(colors.green.bold("Welcome to the chat bot!"));
  console.log(colors.green.bold("How can I assist you today?"));
  const chatHistory = []; //storing chat history

  while (true) {
    const userInput = readlineSync.question(colors.yellow("You: "));
    try {

      //construct messages by iterating over the chathistory
      const messages = chatHistory.map(([role,content])=>({role,content}));

      //Add new userinput in messages
      messages.push({role:'user',content:userInput});

      //Api call with user input
      const chatCompletion = await openAi.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
      });

      //chat completion Text
      const reply = chatCompletion.choices[0].message.content;

      //exit code
      if (userInput.toLowerCase() === "exit") {
        console.log(colors.yellow("Bot: ") + reply);
        console.log(colors.green.bold("Signing off..."));
        return;
      }
      console.log(colors.yellow("Bot: ") + reply);

      //Update chat history
      chatHistory.push(["user",userInput]);
      chatHistory.push(["assistant",reply]);

    } catch (error) {
      console.log(colors.red(error));
    }
  }
}

main();
