import { ScrollView, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'

import firestore from '@react-native-firebase/firestore'
import { getUniqueId } from 'react-native-device-info'
import { DataTable } from 'react-native-paper'

import { useTheme } from '@/Hooks'

const optionsPerPage = [2, 3, 4]

export default function HistoryContainer() {
  const { Gutters, Layout, Fonts } = useTheme()

  const [collections, setCollections] = useState<any[]>([])
  const [page, setPage] = React.useState<number>(0)
  const [itemsPerPage, setItemsPerPage] = React.useState(optionsPerPage[0])

  useEffect(() => {
    let subscriber: any = null

    ;(async () => {
      const deviceId = await getUniqueId()

      subscriber = firestore()
        .collection('Users')
        .where('deviceId', '==', deviceId)
        .orderBy('createdAt', 'desc')
        .onSnapshot(onResult, onError)
    })()

    if (subscriber) {
      return () => subscriber()
    }
  }, [])

  const onResult = (QuerySnapshot: any) => {
    setCollections(QuerySnapshot.docs)
  }

  const onError = (error: any) => {
    console.error(error)
  }

  return (
    <ScrollView
      style={Layout.fill}
      contentContainerStyle={[
        Gutters.smallHPadding,
        Gutters.smallVPadding,
        styles.main,
      ]}
    >
      <DataTable style={styles.dataTable}>
        <DataTable.Header style={styles.header}>
          <DataTable.Title
            textStyle={
              (Fonts.textRegular, { fontWeight: '600', color: '#fff' })
            }
          >
            #
          </DataTable.Title>
          <DataTable.Title
            numeric
            textStyle={
              (Fonts.textRegular, { fontWeight: '600', color: '#fff' })
            }
          >
            Class
          </DataTable.Title>
          <DataTable.Title
            numeric
            textStyle={
              (Fonts.textRegular, { fontWeight: '600', color: '#fff' })
            }
          >
            Estimation
          </DataTable.Title>
        </DataTable.Header>

        {collections?.map((collection: any, index: number) => (
          <DataTable.Row key={index}>
            <DataTable.Cell>{index}</DataTable.Cell>
            <DataTable.Cell numeric>{collection._data.classes}</DataTable.Cell>
            <DataTable.Cell numeric>
              {collection._data.estimation}
            </DataTable.Cell>
          </DataTable.Row>
        ))}

        <DataTable.Pagination
          page={page}
          numberOfPages={3}
          onPageChange={page => setPage(page)}
          label="1-2 of 6"
          optionsPerPage={optionsPerPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          showFastPagination
          optionsLabel={'Rows per page'}
        />
      </DataTable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: 'rgba(217, 217, 217, 0.25)',
  },
  dataTable: {
    marginBottom: 100,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  header: {
    backgroundColor: '#FAAD17',
  },
})
