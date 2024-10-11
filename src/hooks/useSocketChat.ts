import {FormEvent, KeyboardEvent, useEffect, useRef} from "react";
import {useSelector} from "react-redux";
import {messagesActions, selectMessages, selectTypingUsers, SubmitMessage} from "../model/messagesSlice";
import {selectUserName, userActions} from "../model/userSlice";
import {useAppDispatch} from "../model/store";
import {socketApi} from "../api/socketApi";
import {throttling} from "../utils/throttling";

export const useSocketChat = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const dispatch = useAppDispatch();
  const dispatchThrottling = throttling(dispatch, 4000)
  const messages = useSelector(selectMessages)
  const typingUsers = useSelector(selectTypingUsers)
  const userName = useSelector(selectUserName)

  useEffect(() => {
    dispatch(messagesActions.setConnection())

    return () => {
      dispatch(messagesActions.setDisconnect())
    }
  }, []);

  useEffect(() => {
    if (containerRef.current && userName) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, userName, typingUsers]); // Зависимость от messages

  useEffect(() => {
    if (userName) {
      dispatch(messagesActions.addMessageOnChangeUserStatus({currentUserName: userName}))
      dispatch(messagesActions.userTypeMessage())
    }
  }, [userName]); // Зависимость от messages

  const onSubmit = () => {
    if (textareaRef?.current && textareaRef.current.value) {
      const data: SubmitMessage = {userName: userName || 'Someone', message: textareaRef.current.value}
      dispatch(messagesActions.sendMessage(data))
      textareaRef.current.value = ''
    }
  }

  const onEnterUserName = () => {
    if (textareaRef?.current && textareaRef.current.value) {
      const userName = textareaRef.current.value
      dispatch(userActions.setUserName({userName}))
      textareaRef.current.value = ''
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    userName ? onSubmit() : onEnterUserName()
  }

  const handleKeyboardDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {

    if (userName) {
      dispatchThrottling(messagesActions.typeMessage())
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      userName ? onSubmit() : onEnterUserName()
    }
  }

  return {user: userName, messages, containerRef, textareaRef, handleSubmit, handleKeyboardDown, typingUsers}
}