import React, { useEffect, useState } from "react";
import { ImageBackground, View } from "react-native";
import AppBar from '../../components/control/appbar';
import DateRangePicker from "../../components/daterangepicker";
import SalesList from "../../components/others/saleslist";
import Loading from "../../components/loading/loading";

import { AuthContext } from "../../context/authcontext";

import Constants from "expo-constants";
import { useRoute, useNavigation } from "@react-navigation/native";
import CustomLoading from "../../components/control/customloading";
import BackgroundPhoto from "../../assets/Beige Blue Modern Abstract Line Shape Bookmark.png";



export default function StoreHistoryScreen({})
{
    const route = useRoute();
    const nav = useNavigation();
    const { API_BASE_URL } = Constants.expoConfig.extra;
	const { storeId, storeName } = route.params; 
	const { userToken, user } = React.useContext(AuthContext);
    const [data, setData] = useState();

    const [dateRange, setDateRange] = useState({
        from: new Date(),
        to: new Date()
    })
    const [isLoading, setIsLoading] = useState(false);

    const fetchSalesByDate = async () => {
        try {
			setIsLoading(true);
            const fromStr = dateRange.from.toISOString().split('T')[0];
            const toStr = dateRange.to.toISOString().split('T')[0];
            console.log(storeId, fromStr, toStr);
			const res = await fetch(`${API_BASE_URL}/api/Sales/fetchsalesbydate?storeId=${storeId}&from=${fromStr}&to=${toStr}`, {headers});
			if (!res.ok) throw new Error("Failed to fetch store items");
			const data = await res.json();
            console.log(data);
            setData(data);
		} catch (err) {
			console.error("Fetch error:", err);
            alert("Fetch error:", err);
            setIsLoading(false);
		} finally {
			setIsLoading(false);
		}
    };

    const headers = {
				"method": "GET",
				"Content-Type": "application/json",
				"Authorization": `Bearer ${userToken}`,
	};

    const handleBackPress = () => {
        nav.goBack();
    }

    const handleDateChange = (type, selectedDate) => {
        setDateRange(prev => ({
            ...prev,
            [type]: selectedDate
        }));
        console.log(`Updating ${type} to:`, selectedDate.toLocaleDateString());
    };

    useEffect(() => {
            fetchSalesByDate();
        }, [dateRange]);

    return(
        <ImageBackground source={BackgroundPhoto} style={{ flex: 1 }} resizeMode="stretch">
            <View style={{ flex: 1 }}>
                <AppBar 
                    title={`Sales History of ${storeName}`}
                    onBackPress={handleBackPress}
                />
                <DateRangePicker onUpdate={handleDateChange}/>

                {!isLoading ? (
                    <SalesList data={data}/>
                )
                :
                (
                    <Loading/>
                )}
            </View>

        </ImageBackground>
    );
}