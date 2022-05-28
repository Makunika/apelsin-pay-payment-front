import {Accordion, AccordionDetails, AccordionSummary, Typography} from "@mui/material";
import PropTypes from "prop-types";
import Iconify from "./Iconify";

SimpleAccordion.propTypes = {
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    defaultExpanded: PropTypes.bool
};

export default function SimpleAccordion({title, body, defaultExpanded = false}) {
    
    return (
        <Accordion defaultExpanded={defaultExpanded}>
            <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-outline" />}>
                <Typography>
                    {title}
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>
                    {body}
                </Typography>
            </AccordionDetails>
        </Accordion>
    )
}