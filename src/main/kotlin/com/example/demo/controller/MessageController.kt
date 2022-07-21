package com.example.demo.controller

import com.example.demo.model.Message
import com.example.demo.model.User
import com.example.demo.response.OutputMessage
import com.example.demo.response.OutputUser
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.stereotype.Controller
import java.text.SimpleDateFormat
import java.util.*

@Controller
class MessageController {

    @MessageMapping("/chat") //app/chat
    @SendTo("/topic/messages")
    fun send(message: Message): OutputMessage? {
        val time = SimpleDateFormat("HH:mm").format(Date())
        return OutputMessage(message.from, message.text, time)
    }

    @MessageMapping("/user") //app/user
    @SendTo("/topic/user")
    fun newUser(user: User): OutputUser? {
        return OutputUser(user.name)
    }
}