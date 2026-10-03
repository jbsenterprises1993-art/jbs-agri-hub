import * as FirebaseAuth from '@react-native-firebase/auth';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const auth = (FirebaseAuth as any).default as (() => any);

export default function LoginScreen() {
  const [phone,setPhone]=useState(''); const [otp,setOtp]=useState(''); const [otpSent,setOtpSent]=useState(false);
  const [confirmation,setConfirmation]=useState<any>(null); const [loading,setLoading]=useState(false);
  const sendOTP=async()=>{const cleanPhone=phone.replace(/\D/g,''); if(cleanPhone.length!==10){Alert.alert('Invalid Mobile Number','10 digit mobile number enter pannunga.');return;}
    try{setLoading(true);const result=await auth().signInWithPhoneNumber('+91'+cleanPhone);setConfirmation(result);setOtpSent(true);Alert.alert('OTP Sent','உங்கள் mobile number-க்கு OTP அனுப்பப்பட்டது.');}
    catch(error:any){let message=error?.message||'OTP அனுப்ப முடியவில்லை.';if(error?.code==='auth/invalid-phone-number')message='Mobile number சரியாக இல்லை.';else if(error?.code==='auth/too-many-requests')message='அதிக OTP requests செய்யப்பட்டுள்ளது. சிறிது நேரம் கழித்து மீண்டும் முயற்சி செய்யவும்.';else if(error?.code==='auth/quota-exceeded')message='Firebase SMS quota முடிந்துள்ளது. Firebase settings check செய்யவும்.';Alert.alert('OTP Error',message);}
    finally{setLoading(false);}
  };
  const verifyOTP=async()=>{const cleanOtp=otp.replace(/\D/g,'');if(cleanOtp.length!==6){Alert.alert('Invalid OTP','6 digit OTP enter pannunga.');return;}if(!confirmation){Alert.alert('OTP Error','முதலில் Send OTP அழுத்தி OTP பெறவும்.');return;}
    try{setLoading(true);await confirmation.confirm(cleanOtp);Alert.alert('Login Success','Mobile number successfully verified.',[{text:'OK',onPress:()=>router.replace('/products')}]);}
    catch(error:any){let message=error?.message||'OTP verify செய்ய முடியவில்லை.';if(error?.code==='auth/invalid-verification-code')message='நீங்கள் enter செய்த OTP தவறாக உள்ளது.';else if(error?.code==='auth/session-expired')message='OTP காலாவதியாகிவிட்டது. புதிய OTP request செய்யவும்.';Alert.alert('Verification Failed',message);}
    finally{setLoading(false);}
  };
  const changeNumber=()=>{setOtp('');setOtpSent(false);setConfirmation(null);};
  return <SafeAreaView style={styles.container}><View style={styles.card}><Text style={styles.logo}>🌱 JBS</Text><Text style={styles.title}>JBS Agri Hub</Text><Text style={styles.subtitle}>Mobile Number Login</Text>
    {!otpSent?<><Text style={styles.label}>Mobile Number</Text><View style={styles.phoneRow}><View style={styles.countryCode}><Text style={styles.countryText}>+91</Text></View><TextInput style={styles.phoneInput} placeholder="Enter 10 digit mobile number" keyboardType="phone-pad" maxLength={10} value={phone} editable={!loading} onChangeText={t=>setPhone(t.replace(/\D/g,''))}/></View>
    <TouchableOpacity style={[styles.button,loading&&styles.disabledButton]} onPress={sendOTP} disabled={loading}>{loading?<ActivityIndicator color="#fff"/>:<Text style={styles.buttonText}>Send OTP</Text>}</TouchableOpacity></>
    :<><Text style={styles.sentText}>OTP sent to +91 {phone}</Text><Text style={styles.label}>Enter OTP</Text><TextInput style={styles.otpInput} placeholder="6 digit OTP" keyboardType="number-pad" maxLength={6} value={otp} editable={!loading} onChangeText={t=>setOtp(t.replace(/\D/g,''))}/>
    <TouchableOpacity style={[styles.button,loading&&styles.disabledButton]} onPress={verifyOTP} disabled={loading}>{loading?<ActivityIndicator color="#fff"/>:<Text style={styles.buttonText}>Verify OTP</Text>}</TouchableOpacity><TouchableOpacity onPress={changeNumber} disabled={loading}><Text style={styles.changeNumber}>Change Mobile Number</Text></TouchableOpacity></>}
  </View></SafeAreaView>;
}
const styles=StyleSheet.create({container:{flex:1,backgroundColor:'#f2f8f2',justifyContent:'center',padding:20},card:{backgroundColor:'#fff',borderRadius:20,padding:24,elevation:5},logo:{fontSize:42,textAlign:'center',fontWeight:'bold',color:'#176b36'},title:{fontSize:28,fontWeight:'bold',textAlign:'center',color:'#176b36',marginTop:8},subtitle:{fontSize:16,textAlign:'center',color:'#666',marginTop:6,marginBottom:30},label:{fontSize:15,fontWeight:'600',marginBottom:8,color:'#333'},phoneRow:{flexDirection:'row',marginBottom:20},countryCode:{width:60,height:52,borderWidth:1,borderColor:'#ccc',borderRadius:10,justifyContent:'center',alignItems:'center',marginRight:8},countryText:{fontSize:16,fontWeight:'600'},phoneInput:{flex:1,height:52,borderWidth:1,borderColor:'#ccc',borderRadius:10,paddingHorizontal:12,fontSize:16},otpInput:{height:52,borderWidth:1,borderColor:'#ccc',borderRadius:10,paddingHorizontal:15,fontSize:20,letterSpacing:6,textAlign:'center',marginBottom:20},button:{height:52,backgroundColor:'#176b36',borderRadius:10,justifyContent:'center',alignItems:'center'},disabledButton:{opacity:0.6},buttonText:{color:'#fff',fontSize:17,fontWeight:'bold'},sentText:{textAlign:'center',color:'#176b36',fontWeight:'600',marginBottom:22},changeNumber:{textAlign:'center',color:'#176b36',fontWeight:'600',marginTop:20}});
