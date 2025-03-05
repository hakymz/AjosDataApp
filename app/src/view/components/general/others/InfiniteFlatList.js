import React from 'react';
import {ActivityIndicator, FlatList, View, RefreshControl} from 'react-native';
import {useInfiniteQuery} from 'react-query';
import {COLORS} from '../../../../conts';
import {Text} from '../text';
export const InfiniteFlatList = ({
  request,
  queryKey = 'ecmmerce',
  searchValue,
  refetchData,
  keyProps = 'result',
  category,
  contentContainerStyle,
  noDataCom,
  ...props
}) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const loadingNextPage = React.useRef(false);

  const onRefresh = React.useCallback(() => {
    (async () => {
      setRefreshing(true);
      await refetch();
      setRefreshing(false);
    })();
  }, []);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isFetched,
    isRefetching,
    isLoading,
    status,
    refetch,
  } = useInfiniteQuery(queryKey, request, {
    getNextPageParam: (lastPage, pages) => {
      const {current_page, number_of_pages, page_total, hasNextPage} =
        lastPage || {};
      console.log(
        page_total > current_page ? current_page + 1 : undefined,
        'hasNextPage hasNextPage',
        page_total,
        current_page,
      );

      return page_total > current_page ? current_page + 1 : undefined;
    },
  });

  React.useEffect(() => {
    refetch();
  }, [refetchData, searchValue]);

  React.useEffect(() => {
    loadingNextPage.current = false;
  }, [isFetched, error]);
  const getData = pages => {
    const currentPages = [];

    if (Array.isArray(pages?.[0]?.[keyProps] || pages?.[0]?.data)) {
      pages?.forEach(element => {
        element?.[keyProps]?.forEach(currentElement => {
          currentPages.push(currentElement);
        });
      });
    }

    return currentPages;
  };

  const pageData = React.useMemo(() => {
    const currData = getData(data?.pages);

    return currData;
  }, [data]);

  if (isFetching && !hasNextPage) {
    return (
      <View style={{marginTop: 40}}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <FlatList
      ListHeaderComponent={() => {
        if (pageData?.length == 0) {
          return (
            noDataCom || (
              <Text
                lineHeight={28}
                size={20}
                style={{marginTop: 40, textAlign: 'center'}}>
                No data found
              </Text>
            )
          );
        }
      }}
      // onEndReachedThreshold ={0}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      onEndReached={() => {
        loadingNextPage.current = true;
        console.log('yess reacccc');
        setTimeout(() => {
          if (hasNextPage && !isFetching) {
            fetchNextPage();
          }
        }, 1000);
      }}
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 20,
        ...contentContainerStyle,
      }}
      data={pageData}
      ListFooterComponent={
        <View>
          {isFetching && (
            <ActivityIndicator size="large" color={COLORS.primary} />
          )}
        </View>
      }
      {...props}
    />
  );
};
