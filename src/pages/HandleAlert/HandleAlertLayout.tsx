import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import { Outlet, useNavigate, useLocation, useParams } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { getAlertById } from '../../services/alertService';
import { postEmergencyServiceRequest } from '../../services/emergencyService';
import { postTowingRequest } from '../../services/towingService';
const STEPS_CONFIG = [
    { label: 'Alert Information', path: '' },
    { label: 'Emergency Request', path: 'emergency-request' },
    { label: 'Towing Request', path: 'towing-request' }
];
interface AlertFormContextType {
    formData: {
        emergencyPayload: {
            hospitalAssigned: string;
            phone: string;
            alertId: number;
        };
        towingPayload: {
            towingCompany: string;
            alertId: number;
            tripId: number;
        };
    };
    apiSuccessState: {
        emergencyDone: boolean;
        towingDone: boolean;
    };
    updateFormData: (fields: any) => void;
}
//Explicitly type the context, using null as the initial default value
export const AlertFormContext = React.createContext<AlertFormContextType | null>(null);
export default function HandleAlertLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { alertId } = useParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [alertDetails, setAlertDetails] = useState<any>(null);
    const [formData, setFormData] = useState({
        emergencyPayload: {
            hospitalAssigned: '',
            phone: '',
            alertId: Number(alertId),
        },
        towingPayload: {
            towingCompany: '',
            alertId: Number(alertId),
            tripId: 0
        }
    });
    const [apiSuccessState, setApiSuccessState] = useState({
        emergencyDone: false,
        towingDone: false
    });
    const updateFormData = (fields: any) => {
        setFormData((prev) => ({ ...prev, ...fields }));
    };

    useEffect(() => {
        async function loadAlertMetadata() {
            try {
                setInitialLoading(true);
                const alertData = await getAlertById(Number(alertId));
                console.log(alertData)
                setAlertDetails(alertData.data);
                setFormData(prev => ({
                    ...prev,

                    towingPayload: {
                        ...prev.towingPayload,
                        tripId: alertData.data.tripId // Satisfies the Zod schema rule
                    }
                }));
            } catch (error) {
                console.error("Failed fetching alert details:", error);
                alert("Could not pull required Trip ID data for this alert.");
            } finally {
                setInitialLoading(false);
            }
        }
        if (alertId) loadAlertMetadata();
    }, [alertId]);
    // 2. Compute the current active step index dynamically based on the current URL path
    const activeStep = React.useMemo(() => {
        const currentSubPath = location.pathname.split('/').pop();
        const index = STEPS_CONFIG.findIndex(step =>
            step.path === currentSubPath || (step.path === '' && currentSubPath === 'handle-alert')
        );
        return index !== -1 ? index : 0;
    }, [location.pathname]);

    const handleNext = async () => {
        if (activeStep < STEPS_CONFIG.length - 1) {
            const nextStepPath = STEPS_CONFIG[activeStep + 1].path;
            navigate(nextStepPath);
        } else {
            setIsSubmitting(true);
            let emergencySucceeded = apiSuccessState.emergencyDone;
            let towingSucceeded = apiSuccessState.towingDone;
            if (!emergencySucceeded) {
                try {
                    await postEmergencyServiceRequest(formData.emergencyPayload);
                    emergencySucceeded = true;
                    setApiSuccessState(prev => ({ ...prev, emergencyDone: true }));
                } catch (err) {
                    console.error("Emergency dispatch error:", err);
                }
            }
            if (!towingSucceeded) {
                try {
                    await postTowingRequest(formData.towingPayload);
                    towingSucceeded = true;
                    setApiSuccessState(prev => ({ ...prev, towingDone: true }));
                } catch (err) {
                    console.error("Towing request error:", err);
                }
            }
            if (emergencySucceeded && towingSucceeded) {
                alert("Both requests saved successfully!");
                navigate('/fleet-manager/dashboard');
                setIsSubmitting(false);
                return;
            }
            if (!emergencySucceeded && !towingSucceeded) {
                alert("Both sub-requests failed to process. Check input values.");
                setIsSubmitting(false);
                return;
            }
            const baseRoute = `/fleet-manager/alerts/${alertId}/handle-alert`;
            if (emergencySucceeded && !towingSucceeded) {
                alert("Emergency request saved! Towing provider rejected the setup. Please correct Towing inputs on this page and retry.");
                setIsSubmitting(false);
                return;
            }
            if (!emergencySucceeded && towingSucceeded) {
                alert("Towing order saved! Hospital setup failed. Redirecting you back to correct Emergency inputs.");
                setIsSubmitting(false);
                navigate(`${baseRoute}/emergency-request`);
                return;
            }
        }
    };
    const handleBack = () => {
        if (activeStep > 0) {
            const prevStepPath = STEPS_CONFIG[activeStep - 1].path;
            navigate(prevStepPath);
        }
    };
    return (
        <AlertFormContext.Provider value={{ formData, updateFormData, apiSuccessState }}>
            <Box sx={{ width: '100%', p: 3 }}>
                <Stepper activeStep={activeStep} alternativeLabel className='mb-0'>
                    {STEPS_CONFIG.map((step, index) => {
                        const isStepDone =
                            (index === 1 && apiSuccessState.emergencyDone) ||
                            (index === 2 && apiSuccessState.towingDone);
                        return (
                            <Step key={step.label} completed={isStepDone || activeStep > index}>
                                <StepLabel>{step.label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>

                <Box sx={{ minHeight: '200px', bgcolor: '#f9f9f9', p: 3, borderRadius: 2, mb: 3 }}>
                    <Outlet context={activeStep === 0 ? { alertDetails } : null} />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Button
                        color="inherit"
                        disabled={activeStep === 0 || isSubmitting}
                        onClick={handleBack}
                        sx={{ mr: 1, border: '1px solid #ccc' }}
                    >
                        Back
                    </Button>

                    <Box sx={{ flex: '1 1 auto' }} />

                    <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{ bgcolor: '#5884d2', '&:hover': { bgcolor: '#466cb3' } }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : activeStep === STEPS_CONFIG.length - 1 ? (
                            'Finish'
                        ) : (
                            'Next'
                        )}
                    </Button>
                </Box>
            </Box>
        </AlertFormContext.Provider>
    );
}
