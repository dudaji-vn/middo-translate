

export type StatisticData = {
    client: {
        count: number,
        rate: number
    },
    completedConversation: {
        count: number,
        rate: number
    },
    averageRating: number,
    responseChat: {
        averageTime: string,
        rate: number
    },
    chart: {
        label: string,
        value: number
    }[]
}
