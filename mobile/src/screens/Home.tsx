import { useState, useEffect } from "react";
import { View, Text, ScrollView, Alert  } from "react-native";
import { useNavigation} from '@react-navigation/native';
import { generateRangeDatesFromYearStart } from '../utils/generate-range-between-dates';

import { api } from "../lib/axios";
import { HabitDay, DAY_SIZE } from "../components/HabitDay";
import { Header } from "../components/Header";
//import { Loading} from '../components/Loading';

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const datesFromYearStart = generateRangeDatesFromYearStart();
const minimumSumarryDatesSizes = 18 * 5;
const amountOfDatesToFill = minimumSumarryDatesSizes - datesFromYearStart.length

export function Home() {

    const [loading, setLoading] = useState(true);
    const [sumary, setSumary] = useState(null);

    const { navigate } = useNavigation();

    async function fetchData () {
        try {
            setLoading(true);
            const response = await api.get('/sumary');
        
            setSumary(response.data);
        } catch(error) {
            Alert.alert('Ops', "Não foi possivel carregar o sumário de hábitos.")
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() =>{
        fetchData();
    }, []);

    // if (loading) {
    //    return(
    //        <Loading/>
    //    );
    //} 

    return (
        <View className="flex-1 bg-background px-8 py-16"  >
            <Header />

            <View className="flex-row mt-6 mb-2">
                {
                    weekDays.map((weekDay, i) => (
                        <Text key={`${weekDay}-${i}`}
                            className="text-slate-400 text-xl font-bold text-center mx-1 "
                            style={{ width: DAY_SIZE }}
                        >
                            {weekDay}
                        </Text>
                    ))
                }
            </View>

            <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 100}}
            >   
            <View className="flex-row flex-wrap">
                {
                    datesFromYearStart.map(date => (
                        <HabitDay
                            key={date.toISOString()}
                            onPress={() => navigate('habit', {date: date.toISOString()})}
                        />
                    ))
                }

                {
                    amountOfDatesToFill > 0 && Array
                        .from({ length: amountOfDatesToFill })
                        .map((_, index) => (
                            <View
                            key={index}
                            className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                            style={{ width: DAY_SIZE, height: DAY_SIZE }} />
                        ))
                }
            </View>
            </ScrollView>
        </View>
    )
}