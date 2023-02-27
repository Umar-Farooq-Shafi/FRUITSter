export const getColor = (route: any): string => {
    return route.params?.type === 'apple'
        ? '#EA6D6D'
        : route.params?.type === 'orange'
            ? '#FAAD17'
            : route.params?.type === 'mango'
                ? '#FFE24B'
                : route.params?.type === 'pear'
                    ? '#AED12C'
                    : '#0f0'
}
