import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ImageSourcePropType,
  Linking,
  NativeScrollEvent,
  NativeSyntheticEvent,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "../../constants/Colors";
import styles from "./styles";

interface renderProps {
  item: {
    idbanner: number;
    image: ImageSourcePropType | undefined;
    img: string;
    link: string;
  };
  index: number;
}

type carouselProps = {
  data: any;
};

const CustomCarousel = (props: carouselProps) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const flatListRef = useRef<FlatList<any>>(null);

  const screenWidth = Dimensions.get("window").width;

  const renderItem = ({ item, index }: renderProps) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            if (item.link) {
              Linking.openURL(item.link);
            } else {
              return;
            }
          }}
        >
          <Image source={{ uri: `${item.img}` }} style={styles.image} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderDot = () => {
    return (
      props.data &&
      props.data.map((item: any, index: number) => (
        <View
          style={{
            backgroundColor:
              activeIndex === index
                ? Colors.primary.light
                : Colors.primary.dark,
            borderRadius: 7,
            height: 14,
            width: 14,
            marginHorizontal: 5,
          }}
          key={index}
        ></View>
      ))
    );
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = scrollPosition / screenWidth;
    setActiveIndex(Math.round(index));
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const nextIndex = (activeIndex + 1) % props.data.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 4000);

    return () => clearInterval(intervalId);
  }, [activeIndex]);

  const getItemLayout = (data: any, index: any) => ({
    length: screenWidth,
    offset: screenWidth * index,
    index: index,
  });

  return (
    <View style={styles.imageContainer}>
      <FlatList
        data={props.data}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        onScroll={handleScroll}
        keyExtractor={(item) => item.idbanner.toString()}
        ref={flatListRef}
        getItemLayout={getItemLayout}
      />
      <View style={styles.dotContainer}>{renderDot()}</View>
    </View>
  );
};

export default CustomCarousel;
