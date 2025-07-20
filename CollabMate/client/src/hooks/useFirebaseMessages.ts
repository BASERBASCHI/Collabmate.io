import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  getDoc,
  serverTimestamp,
  or,
  and
} from 'firebase/firestore';
import { db, COLLECTIONS, FirebaseMessage, FirebaseUser } from '../lib/firebase';
import { ChatMessage } from '../types';
import { generateChatSuggestion } from '../lib/gemini';

export const useFirebaseMessages = (userId: string | null, partnerId: string | null) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !partnerId) {
      setLoading(false);
      return;
    }

    // Create real-time listener for messages
    const messagesQuery = query(
      collection(db, COLLECTIONS.MESSAGES),
      or(
        and(where('senderId', '==', userId), where('receiverId', '==', partnerId)),
        and(where('senderId', '==', partnerId), where('receiverId', '==', userId))
      ),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, async (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirebaseMessage[];

      // Format messages for display
      const formattedMessages: ChatMessage[] = [];
      
      for (const msg of messagesData) {
        let senderName = 'Unknown';
        let senderAvatar = 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1';
        
        if (msg.senderId === userId) {
          senderName = 'You';
        } else {
          // Fetch sender info
          const senderDoc = await getDoc(doc(db, COLLECTIONS.USERS, msg.senderId));
          if (senderDoc.exists()) {
            const senderData = senderDoc.data() as FirebaseUser;
            senderName = senderData.displayName;
            senderAvatar = senderData.photoURL || senderAvatar;
          }
        }

        formattedMessages.push({
          id: msg.id,
          senderId: msg.senderId,
          senderName,
          senderAvatar,
          message: msg.message,
          timestamp: msg.createdAt ? new Date(msg.createdAt.toDate()).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          }) : 'Now',
          type: msg.messageType
        });
      }

      setMessages(formattedMessages);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId, partnerId]);

  const sendMessage = async (message: string) => {
    if (!userId || !partnerId || !message.trim()) return;

    try {
      await addDoc(collection(db, COLLECTIONS.MESSAGES), {
        senderId: userId,
        receiverId: partnerId,
        message: message.trim(),
        messageType: 'user',
        createdAt: serverTimestamp()
      });

      // Simulate AI response after a delay
      setTimeout(async () => {
        try {
          // Get partner's name for context
          const partnerDoc = await getDoc(doc(db, COLLECTIONS.USERS, partnerId));
          const partnerName = partnerDoc.exists() ? (partnerDoc.data().displayName || 'your teammate') : 'your teammate';
          
          // Get current user's name
          const currentUserDoc = await getDoc(doc(db, COLLECTIONS.USERS, userId));
          const currentUserName = currentUserDoc.exists() ? (currentUserDoc.data().displayName || 'User') : 'User';
          
          // Generate AI suggestion using Gemini
          const aiSuggestion = await generateChatSuggestion(
            message.trim(),
            currentUserName,
            partnerName,
            'This is a collaboration platform for students and developers working on projects together.'
          );
        
          await addDoc(collection(db, COLLECTIONS.MESSAGES), {
            senderId: 'ai-assistant',
            receiverId: userId,
            message: aiSuggestion,
            messageType: 'ai-suggestion',
            createdAt: serverTimestamp()
          });
        } catch (error) {
          console.error('Error generating AI suggestion:', error);
          // Fallback message
          await addDoc(collection(db, COLLECTIONS.MESSAGES), {
            senderId: 'ai-assistant',
            receiverId: userId,
            message: "Great message! Consider discussing your project goals and next steps.",
            messageType: 'ai-suggestion',
            createdAt: serverTimestamp()
          });
        }
      }, 2000);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return {
    messages,
    loading,
    sendMessage,
    refetch: () => {} // Real-time updates handle this
  };
};