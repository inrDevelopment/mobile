import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Container } from "../../components/Container";
import styles from "./styles";

const data = [
  {
    id: 1,
    title: "O que é o Leitor INR?",
    content:
      "O Leitor INR é uma plataforma de leitura para conteúdos jurídicos.",
  },
  {
    id: 2,
    title: "Por que preciso estar logado para favoritar um conteúdo?",
    content:
      "O leitor INR sincroniza os dados do aplicativo para celular com a versão para Desktop do leitor.",
  },

  {
    id: 3,
    title: "Como posso acessar o conteúdo premium?",
    content:
      "Para acessar o conteúdo premium, você precisa de uma assinatura ativa.",
  },
];

const FaqItem = ({
  id,
  title,
  content,
  expandedId,
  setExpandedId,
}: {
  id: number;
  title: string;
  content: string;
  expandedId: number | null;
  setExpandedId: (id: number | null) => void;
}) => {
  const isExpanded = id === expandedId;

  const handlePress = () => {
    setExpandedId(isExpanded ? null : id); // Fecha se já estiver aberto, senão abre
  };

  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={handlePress} style={styles.itemTouchable}>
        <Text style={styles.itemTitle}>{title}</Text>
      </TouchableOpacity>
      {isExpanded && <Text style={styles.itemContent}>{content}</Text>}
    </View>
  );
};

const FaqScreen = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <Container>
      <Text style={styles.title}>Perguntas Frequentes</Text>
      {data.map((item) => (
        <FaqItem
          key={item.id}
          id={item.id}
          title={item.title}
          content={item.content}
          expandedId={expandedId}
          setExpandedId={setExpandedId}
        />
      ))}
    </Container>
  );
};

export default FaqScreen;
